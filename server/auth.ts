import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User, UserRole, HotelProvider, TravelAgent } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { userRoles } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

declare global {
  namespace Express {
    interface User extends User {
      role?: UserRole;
      hotelProvider?: HotelProvider;
      travelAgent?: TravelAgent;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// User role constants
export const USER_ROLES = {
  CUSTOMER: 1,
  HOTEL_PROVIDER: 2,
  TRAVEL_AGENT: 3,
  ADMIN: 4,
  SUPERADMIN: 5
};

export async function setupAuth(app: Express) {
  // Ensure default roles exist
  await ensureDefaultRoles();

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "white-beach-puerto-galera-secret",
    resave: false,
    saveUninitialized: false,
    store: new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production"
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if the input is an email
        const isEmail = username.includes('@');
        
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }

        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // Update last login
        await storage.updateUserLastLogin(user.id);

        // Add user role data
        const userWithRole = await enrichUserWithRoleData(user);
        
        return done(null, userWithRole);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      
      const userWithRole = await enrichUserWithRoleData(user);
      done(null, userWithRole);
    } catch (error) {
      done(error);
    }
  });

  // Add required auth routes
  setupAuthRoutes(app);
}

async function enrichUserWithRoleData(user: User) {
  // Get user role
  const role = await db.query.userRoles.findFirst({
    where: eq(userRoles.id, user.roleId || USER_ROLES.CUSTOMER)
  });

  // For hotel providers
  let hotelProvider = null;
  if (user.roleId === USER_ROLES.HOTEL_PROVIDER) {
    hotelProvider = await storage.getHotelProviderByUserId(user.id);
  }

  // For travel agents
  let travelAgent = null;
  if (user.roleId === USER_ROLES.TRAVEL_AGENT) {
    travelAgent = await storage.getTravelAgentByUserId(user.id);
  }

  // Return user with role data
  return {
    ...user,
    role,
    hotelProvider,
    travelAgent,
  };
}

async function ensureDefaultRoles() {
  // Check if roles exist
  const existingRoles = await db.query.userRoles.findMany();
  
  if (existingRoles.length === 0) {
    // Create default roles
    await db.insert(userRoles).values([
      {
        id: USER_ROLES.CUSTOMER,
        name: "Customer",
        description: "Regular user who can book tours, hotels, and packages",
        permissions: {
          book: true,
          viewProfile: true,
        }
      },
      {
        id: USER_ROLES.HOTEL_PROVIDER,
        name: "Hotel Provider",
        description: "Hotel owner or manager who can manage their hotel listings",
        permissions: {
          book: true,
          viewProfile: true,
          manageHotels: true,
          viewBookings: true,
        }
      },
      {
        id: USER_ROLES.TRAVEL_AGENT,
        name: "Travel Agent",
        description: "Travel agent who can book on behalf of customers",
        permissions: {
          book: true,
          viewProfile: true,
          bookForOthers: true,
          viewCommission: true,
        }
      },
      {
        id: USER_ROLES.ADMIN,
        name: "Admin",
        description: "Administrator who can manage all content",
        permissions: {
          book: true,
          viewProfile: true,
          manageUsers: true,
          manageContent: true,
          manageBookings: true,
        }
      },
      {
        id: USER_ROLES.SUPERADMIN,
        name: "Superadmin",
        description: "Super administrator with full system access",
        permissions: {
          book: true,
          viewProfile: true,
          manageUsers: true,
          manageContent: true,
          manageBookings: true,
          manageSettings: true,
          manageRoles: true,
          managePayments: true,
          viewReports: true,
        }
      }
    ]);
    
    console.log("Created default user roles");
  }
}

function setupAuthRoutes(app: Express) {
  // Register endpoint
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      // Validate if username or email already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
        roleId: req.body.roleId || USER_ROLES.CUSTOMER
      });

      // If user is registering as a hotel provider
      if (user.roleId === USER_ROLES.HOTEL_PROVIDER && req.body.companyName) {
        await storage.createHotelProvider({
          userId: user.id,
          companyName: req.body.companyName,
          companyAddress: req.body.companyAddress,
          companyPhone: req.body.companyPhone,
          contactPerson: req.body.contactPerson || user.fullName,
          companyEmail: req.body.companyEmail || user.email,
          website: req.body.website,
          logo: req.body.logo,
          commission: req.body.commission,
        });
      }

      // If user is registering as a travel agent
      if (user.roleId === USER_ROLES.TRAVEL_AGENT && req.body.agencyName) {
        await storage.createTravelAgent({
          userId: user.id,
          agencyName: req.body.agencyName,
          agencyAddress: req.body.agencyAddress,
          agencyPhone: req.body.agencyPhone,
          contactPerson: req.body.contactPerson || user.fullName,
          agencyEmail: req.body.agencyEmail || user.email,
          website: req.body.website,
          logo: req.body.logo,
          commission: req.body.commission,
        });
      }

      // Automatically log in the user after registration
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Don't send password back to client
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Password reset request
  app.post("/api/auth/forgot-password", async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (user) {
        // Generate reset token
        const resetToken = randomBytes(32).toString("hex");
        const now = new Date();
        const expires = new Date(now.getTime() + 3600000); // 1 hour from now
        
        // Save token to user
        await storage.updateUserResetToken(user.id, resetToken, expires);
        
        // TODO: Send email with reset link
        // This would use an email service like SendGrid, Mailgun, etc.
        
        res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent" 
        });
      } else {
        // Don't reveal if email exists or not
        res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent" 
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Reset password
  app.post("/api/auth/reset-password", async (req, res, next) => {
    try {
      const { token, password } = req.body;
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Update password and clear token
      await storage.updateUserPassword(user.id, await hashPassword(password));
      
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Check username availability
  app.get("/api/auth/check-username/:username", async (req, res, next) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      res.json({ available: !user });
    } catch (error) {
      next(error);
    }
  });

  // Check email availability
  app.get("/api/auth/check-email/:email", async (req, res, next) => {
    try {
      const { email } = req.params;
      const user = await storage.getUserByEmail(email);
      res.json({ available: !user });
    } catch (error) {
      next(error);
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in" });
}

// Middleware to check if user has a specific role
export function hasRole(roles: number[]) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
    
    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    
    next();
  };
}

// Admin only middleware
export function isAdmin(req, res, next) {
  return hasRole([USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN])(req, res, next);
}

// Super admin only middleware
export function isSuperAdmin(req, res, next) {
  return hasRole([USER_ROLES.SUPERADMIN])(req, res, next);
}

// Hotel provider middleware
export function isHotelProvider(req, res, next) {
  return hasRole([USER_ROLES.HOTEL_PROVIDER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN])(req, res, next);
}

// Travel agent middleware
export function isTravelAgent(req, res, next) {
  return hasRole([USER_ROLES.TRAVEL_AGENT, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN])(req, res, next);
}