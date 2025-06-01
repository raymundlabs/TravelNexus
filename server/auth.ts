import { Express } from "express";
import { supabase } from "./supabase";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertUserSchema } from "@shared/schema";

export function setupAuth(app: Express) {

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