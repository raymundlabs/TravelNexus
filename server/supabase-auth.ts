import { createClient } from '@supabase/supabase-js';
import { Express } from "express";
import session from "express-session";
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

  // Register endpoint - creates user in our database
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, username, fullName, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail ? await storage.getUserByEmail(email) : null;
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash password (you'll need to implement password hashing)
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in database
      const userData = {
        email,
        password: hashedPassword,
        username,
        fullName,
        roleId: role === 'admin' ? 1 : role === 'hotel' ? 2 : role === 'agent' ? 3 : 4, // Default to user role
        isActive: true,
        isEmailVerified: true
      };

      const user = await storage.createUser(userData);

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
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Database error creating new user' });
    }
  });

  // Login endpoint - signs in with database user
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user by username (support email as username too)
      let user = await storage.getUserByUsername(username);
      if (!user && username.includes('@')) {
        user = await storage.getUserByEmail(username);
      }

      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      // Verify password
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      // Determine role based on roleId
      const roleMap = { 1: 'admin', 2: 'hotel', 3: 'agent', 4: 'user' };
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
      res.status(500).json({ error: 'Login failed' });
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