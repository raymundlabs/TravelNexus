import { createClient } from '@supabase/supabase-js';
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      role?: string;
    }
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role?: string;
    }
  }
}

// Create Supabase client with anon key for operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Create Supabase client for regular operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export function setupSupabaseAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));

  // Register endpoint - creates user in Supabase Auth and our database
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, username, fullName, role = 'user' } = req.body;

      console.log('Registration attempt:', { email, username, role });

      // Check if user already exists in our database
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if email already exists (only if method exists)
      let existingEmail = null;
      try {
        existingEmail = await storage.getUserByEmail(email);
      } catch (err) {
        console.log("getUserByEmail not implemented, skipping email check");
      }
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Create user in Supabase Auth first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            role
          }
        }
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        return res.status(400).json({ error: authError.message });
      }

      if (!authData.user) {
        return res.status(400).json({ error: "Failed to create user in authentication system" });
      }

      console.log('User created in Supabase Auth:', authData.user.id);

      // Hash password for our database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Map role names to role IDs
      const getRoleId = (roleName: string): number => {
        switch (roleName) {
          case 'admin': return 1;
          case 'hotel_owner': 
          case 'hotel': return 2;
          case 'travel_agent':
          case 'agent': return 3;
          case 'user':
          default: return 4;
        }
      };

      // Create user in our database with auth_user_id reference
      const userData = {
        email,
        password: hashedPassword,
        username,
        fullName,
        roleId: role === 'admin' ? 1 : role === 'hotel' ? 2 : role === 'agent' ? 3 : 4,
        isActive: true,
        isEmailVerified: true,
        authUserId: authData.user.id
      };

      const user = await storage.createUser(userData);

      console.log('User created in database:', user.id);

      // Store session
      req.session.user = {
        id: user.id.toString(),
        email: user.email,
        role: role
      };

      res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: role
      });
    } catch (error) {
      console.error('Registration error details:', error);
      console.error('Request body:', req.body);
      res.status(400).json({ error: 'Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error') });
    }
  });

  // Login endpoint - signs in with Supabase Auth and our database
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      console.log('Login attempt:', { username });

      // Determine if username is email or actual username
      const isEmail = username.includes('@');
      let email = username;

      // If it's not an email, find the user by username to get their email
      if (!isEmail) {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return res.status(400).json({ error: 'Invalid username or password' });
        }
        email = user.email;
      }

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      if (!authData.user) {
        return res.status(400).json({ error: 'Authentication failed' });
      }

      console.log('User authenticated with Supabase:', authData.user.id);

      // Find user in our database
      let user = isEmail ? await storage.getUserByEmail(email) : await storage.getUserByUsername(username);

      if (!user) {
        return res.status(400).json({ error: 'User not found in database' });
      }

      // Determine role based on roleId
      const roleMap = { 1: 'admin', 2: 'hotel_owner', 3: 'travel_agent', 4: 'user' };
      const userRole = roleMap[user.roleId as keyof typeof roleMap] || 'user';

      // Store session
      req.session.user = {
        id: user.id.toString(),
        email: user.email,
        role: userRole
      };

      res.status(200).json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: userRole
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed: ' + (error instanceof Error ? error.message : 'Unknown error') });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.sendStatus(200);
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.session.user) {
      return res.sendStatus(401);
    }
    res.json(req.session.user);
  });
}

export { supabaseAdmin, supabase };