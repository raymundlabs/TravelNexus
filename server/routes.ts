import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { getUserInfo } from "@replit/repl-auth";
import { 
  insertUserSchema, 
  insertBookingSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware
  const handleError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ error: validationError.message });
    }
    
    console.error("API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  // Destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/destinations/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const destinations = await storage.getFeaturedDestinations(limit);
      res.json(destinations);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const destination = await storage.getDestination(id);
      
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      
      res.json(destination);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/destinations/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await storage.searchDestinations(query);
      res.json(results);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Hotels
  app.get("/api/hotels", async (req, res) => {
    try {
      const hotels = await storage.getHotels();
      res.json(hotels);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/hotels/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const hotels = await storage.getFeaturedHotels(limit);
      res.json(hotels);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hotel = await storage.getHotel(id);
      
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      
      res.json(hotel);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/destinations/:destinationId/hotels", async (req, res) => {
    try {
      const destinationId = parseInt(req.params.destinationId);
      const hotels = await storage.getHotelsByDestination(destinationId);
      res.json(hotels);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/hotels/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await storage.searchHotels(query);
      res.json(results);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Tours
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getTours();
      res.json(tours);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/tours/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const tours = await storage.getFeaturedTours(limit);
      res.json(tours);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tour = await storage.getTour(id);
      
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      
      res.json(tour);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/destinations/:destinationId/tours", async (req, res) => {
    try {
      const destinationId = parseInt(req.params.destinationId);
      const tours = await storage.getToursByDestination(destinationId);
      res.json(tours);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/tours/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await storage.searchTours(query);
      res.json(results);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/packages/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 2;
      const packages = await storage.getFeaturedPackages(limit);
      res.json(packages);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      
      res.json(pkg);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/destinations/:destinationId/packages", async (req, res) => {
    try {
      const destinationId = parseInt(req.params.destinationId);
      const packages = await storage.getPackagesByDestination(destinationId);
      res.json(packages);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/packages/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await storage.searchPackages(query);
      res.json(results);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Special offers
  app.get("/api/special-offers", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const offers = await storage.getSpecialOffers(limit);
      res.json(offers);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const testimonials = await storage.getTestimonials(limit);
      res.json(testimonials);
    } catch (err) {
      handleError(err, res);
    }
  });

  // User registration and authentication
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Bookings
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const statusSchema = z.object({ status: z.string() });
      const { status } = statusSchema.parse(req.body);
      
      const booking = await storage.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      res.json(booking);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Replit Auth endpoints
  app.get("/api/auth/user", (req, res) => {
    try {
      const user = getUserInfo(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      res.json(user);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/auth/login", (req, res) => {
    const redirectUrl = req.query.redirect || "/";
    res.redirect(`https://replit.com/auth_with_repl_site?domain=${process.env.REPL_SLUG}.replit.dev&path=${redirectUrl}`);
  });

  app.get("/api/auth/logout", (req, res) => {
    const redirectUrl = req.query.redirect || "/";
    res.clearCookie("REPLIT_AUTH");
    res.redirect(redirectUrl as string);
  });

  const httpServer = createServer(app);
  return httpServer;
}
