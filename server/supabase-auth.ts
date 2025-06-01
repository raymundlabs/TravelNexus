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

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

  // Register endpoint - creates user in Supabase auth.users
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, username, role = 'user' } = req.body;

      // Create user in Supabase auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          username,
          role
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Store session
      req.session.user = {
        id: data.user.id,
        email: data.user.email!,
        role: data.user.user_metadata.role
      };

      res.status(201).json({
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username,
        role: data.user.user_metadata.role
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Login endpoint - signs in with Supabase auth
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Store session
      req.session.user = {
        id: data.user.id,
        email: data.user.email!,
        role: data.user.user_metadata?.role || 'user'
      };

      res.status(200).json({
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || data.user.email,
        role: data.user.user_metadata?.role || 'user'
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