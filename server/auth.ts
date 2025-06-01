import { Express } from "express";
<<<<<<< HEAD
import { supabase } from "./supabase";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertUserSchema } from "@shared/schema";
=======
import session from "express-session";
import bcrypt from "bcrypt";
import connectPg from "connect-pg-simple";
import { pool } from "./supabase-db"; // Updated to use Supabase connection
import { storage } from "./storage";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { User as SelectUser, insertUserSchema } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Password hashing configuration
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
>>>>>>> 97b1b27826851d0aaaf0a2d90db3b20c29dc2310

export function setupAuth(app: Express) {

<<<<<<< HEAD
=======
  // Configure session
  // Use basic in-memory session store while database connection is being fixed
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Get user from database
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        const isPasswordValid = await comparePasswords(password, user.password);
        
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (error) {
        console.error("Authentication error:", error);
        return done(error);
      }
    })
  );

  // Serialize user to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
>>>>>>> 97b1b27826851d0aaaf0a2d90db3b20c29dc2310
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.fullName,
            // roleId: userData.roleId, // Supabase doesn't directly manage custom role IDs during signup
            // isActive: userData.isActive,
            // isEmailVerified: userData.isEmailVerified,
          }
        }
      });

      if (error) {
        console.error("Supabase signup error:", error);
        return res.status(400).json({ error: error.message });
      }
      
      // Supabase automatically handles session and JWTs. We can return user data.
      const user = data.user;
      if (!user) {
        return res.status(200).json({ message: "Registration successful. Please check your email to verify your account." });
      }

      return res.status(201).json({ message: "Registration successful. Please check your email to verify your account.", user: user });

    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        return res.status(401).json({ error: error.message });
      }

      const user = data.user;
      if (!user) {
        return res.status(401).json({ error: "Authentication failed: No user returned" });
      }

      // Supabase handles the session and JWTs. We can return user data.
      return res.json({ message: "Logged in successfully", user: user, session: data.session });

    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase logout error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Supabase getUser error:", error);
        return res.status(401).json({ error: error.message });
      }

      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Supabase manages the user session, we just return the user object
      return res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Middleware to protect routes
  app.use(async (req, res, next) => {
    // Exclude auth routes from this middleware if they handle authentication themselves
    if (req.path.startsWith('/api/auth')) {
      return next();
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
      }

      // Attach user to request for downstream handlers
      (req as any).user = user;
      next();
    } catch (error) {
      console.error("Authentication middleware error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

}