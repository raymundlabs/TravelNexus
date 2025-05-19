import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";
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

  // Set up authentication
  setupAuth(app);
  
  // Direct login route for testing
  app.post('/api/direct-login', (req, res) => {
    const { username, password } = req.body;
    
    // Test user credentials
    const testUsers = [
      { id: 1, username: 'demouser', password: 'test123', roleId: 1, email: 'user@example.com', fullName: 'Demo User' },
      { id: 2, username: 'hotelowner', password: 'test123', roleId: 2, email: 'hotel@example.com', fullName: 'Hotel Owner' },
      { id: 3, username: 'travelagent', password: 'test123', roleId: 3, email: 'agent@example.com', fullName: 'Travel Agent' },
      { id: 4, username: 'admin', password: 'test123', roleId: 4, email: 'admin@example.com', fullName: 'Administrator' }
    ];
    
    const user = testUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Login successful
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Login failed' });
        }
        return res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          roleId: user.roleId
        });
      });
    } else {
      // Login failed
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
  
  // Add a user endpoint for session verification
  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated() && req.user) {
      return res.json({
        id: req.user.id,
        username: req.user.username, 
        email: req.user.email,
        fullName: req.user.fullName,
        roleId: req.user.roleId
      });
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
