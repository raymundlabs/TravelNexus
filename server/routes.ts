import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth, isAuthenticated, isAdmin, isSuperAdmin, isHotelProvider, isTravelAgent, USER_ROLES } from "./auth";
import { 
  insertUserSchema, 
  insertBookingSchema,
  insertHotelSchema,
  insertTourSchema,
  insertPackageSchema,
  insertTestimonialSchema,
  userRoles,
  hotels,
  tours,
  packages,
  testimonials,
  payments,
  paymentMethods,
  bankTransfers,
  bookings
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

// Initialize Stripe if API key exists
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as any,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
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
  
  // Admin API: Create Hotel
  app.post("/api/hotels", isHotelProvider, async (req, res) => {
    try {
      const hotelSchema = insertHotelSchema.extend({
        imageUrl: z.string().url(),
        amenities: z.array(z.string()).optional()
      });
      
      const hotelData = hotelSchema.parse(req.body);
      
      const [hotel] = await db.insert(hotels).values(hotelData).returning();
      res.status(201).json(hotel);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Update Hotel
  app.put("/api/hotels/:id", isHotelProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get existing hotel
      const existingHotel = await storage.getHotel(id);
      if (!existingHotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      
      // If user is hotel provider, check if they own this hotel
      if (req.user.roleId === USER_ROLES.HOTEL_PROVIDER) {
        const hotelProvider = await storage.getHotelProviderByUserId(req.user.id);
        if (!hotelProvider) {
          return res.status(403).json({ error: "You don't have permission to manage hotels" });
        }
      }
      
      const hotelSchema = insertHotelSchema.extend({
        imageUrl: z.string().url(),
        amenities: z.array(z.string()).optional()
      }).partial();
      
      const hotelData = hotelSchema.parse(req.body);
      
      const [updatedHotel] = await db
        .update(hotels)
        .set(hotelData)
        .where(eq(hotels.id, id))
        .returning();
      
      res.json(updatedHotel);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Delete Hotel
  app.delete("/api/hotels/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if hotel exists
      const existingHotel = await storage.getHotel(id);
      if (!existingHotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      
      await db.delete(hotels).where(eq(hotels.id, id));
      res.status(204).send();
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
  
  // Admin API: Create Tour
  app.post("/api/tours", isAdmin, async (req, res) => {
    try {
      const tourSchema = insertTourSchema.extend({
        imageUrl: z.string().url()
      });
      
      const tourData = tourSchema.parse(req.body);
      
      const [tour] = await db.insert(tours).values(tourData).returning();
      res.status(201).json(tour);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Update Tour
  app.put("/api/tours/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get existing tour
      const existingTour = await storage.getTour(id);
      if (!existingTour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      
      const tourSchema = insertTourSchema.extend({
        imageUrl: z.string().url()
      }).partial();
      
      const tourData = tourSchema.parse(req.body);
      
      const [updatedTour] = await db
        .update(tours)
        .set(tourData)
        .where(eq(tours.id, id))
        .returning();
      
      res.json(updatedTour);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Delete Tour
  app.delete("/api/tours/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if tour exists
      const existingTour = await storage.getTour(id);
      if (!existingTour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      
      await db.delete(tours).where(eq(tours.id, id));
      res.status(204).send();
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
  
  // Admin API: Create Package
  app.post("/api/packages", isAdmin, async (req, res) => {
    try {
      const packageSchema = insertPackageSchema.extend({
        imageUrl: z.string().url(),
        includedServices: z.array(z.string()).optional(),
        excludedServices: z.array(z.string()).optional()
      });
      
      const packageData = packageSchema.parse(req.body);
      
      const [packageItem] = await db.insert(packages).values(packageData).returning();
      res.status(201).json(packageItem);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Update Package
  app.put("/api/packages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get existing package
      const existingPackage = await storage.getPackage(id);
      if (!existingPackage) {
        return res.status(404).json({ error: "Package not found" });
      }
      
      const packageSchema = insertPackageSchema.extend({
        imageUrl: z.string().url(),
        includedServices: z.array(z.string()).optional(),
        excludedServices: z.array(z.string()).optional()
      }).partial();
      
      const packageData = packageSchema.parse(req.body);
      
      const [updatedPackage] = await db
        .update(packages)
        .set(packageData)
        .where(eq(packages.id, id))
        .returning();
      
      res.json(updatedPackage);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Delete Package
  app.delete("/api/packages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if package exists
      const existingPackage = await storage.getPackage(id);
      if (!existingPackage) {
        return res.status(404).json({ error: "Package not found" });
      }
      
      await db.delete(packages).where(eq(packages.id, id));
      res.status(204).send();
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
  
  // Admin API: Create Testimonial
  app.post("/api/testimonials", isAdmin, async (req, res) => {
    try {
      const testimonialSchema = insertTestimonialSchema.extend({
        userImage: z.string().url().optional()
      });
      
      const testimonialData = testimonialSchema.parse(req.body);
      
      const [testimonial] = await db.insert(testimonials).values(testimonialData).returning();
      res.status(201).json(testimonial);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Update Testimonial
  app.put("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if testimonial exists
      const [existingTestimonial] = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.id, id));
        
      if (!existingTestimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      
      const testimonialSchema = insertTestimonialSchema.extend({
        userImage: z.string().url().optional()
      }).partial();
      
      const testimonialData = testimonialSchema.parse(req.body);
      
      const [updatedTestimonial] = await db
        .update(testimonials)
        .set(testimonialData)
        .where(eq(testimonials.id, id))
        .returning();
      
      res.json(updatedTestimonial);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Admin API: Delete Testimonial
  app.delete("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if testimonial exists
      const [existingTestimonial] = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.id, id));
        
      if (!existingTestimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      
      await db.delete(testimonials).where(eq(testimonials.id, id));
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  });

  // User management endpoints are handled by auth.ts setupAuth function
  // The following routes are automatically set up:
  // POST /api/auth/register - Register a new user
  // POST /api/auth/login - Login user
  // POST /api/auth/logout - Logout user
  // GET /api/auth/user - Get current user info
  // POST /api/auth/forgot-password - Request password reset
  // POST /api/auth/reset-password - Reset password
  // GET /api/auth/check-username/:username - Check username availability
  // GET /api/auth/check-email/:email - Check email availability

  // Bookings - Protected endpoints
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      // Add user ID from the authenticated user
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Get current user's bookings
  app.get("/api/bookings/my", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.user.id);
      res.json(bookings);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Admin or provider can get any user's bookings
  app.get("/api/users/:userId/bookings", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Update booking status (restricted to admins or the booking owner)
  app.patch("/api/bookings/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const statusSchema = z.object({ status: z.string() });
      const { status } = statusSchema.parse(req.body);
      
      // Check booking ownership or admin rights
      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.id, id)
      });
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      const isOwner = booking.userId === req.user.id;
      const isAdmin = req.user.roleId === USER_ROLES.ADMIN || req.user.roleId === USER_ROLES.SUPERADMIN;
      const isHotelOwner = booking.bookingType === 'hotel' && 
                            booking.hotelProviderId === req.user.hotelProvider?.id;
      
      if (!isOwner && !isAdmin && !isHotelOwner) {
        return res.status(403).json({ error: "You don't have permission to update this booking" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Payment Methods
  app.get("/api/payment-methods", async (req, res) => {
    try {
      const allMethods = await db.query.paymentMethods.findMany({
        where: eq(paymentMethods.isActive, true)
      });
      res.json(allMethods);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Stripe Payment Intent - Credit Card Payment
  app.post("/api/payments/create-intent", isAuthenticated, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }

      const { amount, bookingId } = req.body;
      
      if (!amount || !bookingId) {
        return res.status(400).json({ error: "Amount and bookingId are required" });
      }

      // Create a PaymentIntent with the booking and user details
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "php", // Philippine Peso
        metadata: {
          bookingId: bookingId.toString(),
          userId: req.user.id.toString()
        }
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (err) {
      handleError(err, res);
    }
  });

  // Bank Transfer Payment
  app.post("/api/payments/bank-transfer", isAuthenticated, async (req, res) => {
    try {
      // Parse request
      const bankTransferSchema = z.object({
        bookingId: z.number(),
        paymentMethodId: z.number(),
        amount: z.number().positive(),
        bankName: z.string(),
        accountName: z.string(),
        accountNumber: z.string(),
        referenceNumber: z.string().optional(),
        transferDate: z.string().optional(),
        notes: z.string().optional(),
        proofOfPaymentUrl: z.string().optional(),
      });

      const data = bankTransferSchema.parse(req.body);
      
      // 1. Create payment record
      const [payment] = await db.insert(payments).values({
        bookingId: data.bookingId,
        userId: req.user.id,
        amount: data.amount,
        paymentMethodId: data.paymentMethodId,
        paymentStatus: 'pending',
        paymentDetails: { method: 'bank_transfer' }
      }).returning();
      
      // 2. Create bank transfer record
      const [bankTransfer] = await db.insert(bankTransfers).values({
        paymentId: payment.id,
        bankName: data.bankName,
        accountName: data.accountName, 
        accountNumber: data.accountNumber,
        referenceNumber: data.referenceNumber,
        transferDate: data.transferDate ? new Date(data.transferDate) : null,
        notes: data.notes,
        proofOfPaymentUrl: data.proofOfPaymentUrl
      }).returning();
      
      res.status(201).json({ payment, bankTransfer });
    } catch (err) {
      handleError(err, res);
    }
  });

  // Verify Bank Transfer (Admin/Staff only)
  app.post("/api/payments/bank-transfer/:id/verify", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const verifySchema = z.object({ 
        verified: z.boolean() 
      });
      
      const { verified } = verifySchema.parse(req.body);
      
      // 1. Update bank transfer
      const [bankTransfer] = await db
        .update(bankTransfers)
        .set({ 
          verifiedBy: req.user.id,
          verifiedAt: verified ? new Date() : null
        })
        .where(eq(bankTransfers.id, id))
        .returning();
      
      if (!bankTransfer) {
        return res.status(404).json({ error: "Bank transfer not found" });
      }
      
      // 2. Update payment status
      const [payment] = await db
        .update(payments)
        .set({ 
          paymentStatus: verified ? 'completed' : 'failed'
        })
        .where(eq(payments.id, bankTransfer.paymentId))
        .returning();
      
      // 3. Update booking status if payment is verified
      let booking = null;
      if (verified) {
        [booking] = await db
          .update(bookings)
          .set({ 
            status: 'confirmed',
            confirmedAt: new Date()
          })
          .where(eq(bookings.id, payment.bookingId))
          .returning();
      }
      
      res.json({ bankTransfer, payment, booking });
    } catch (err) {
      handleError(err, res);
    }
  });

  // Admin routes
  // Get all users (super admin only)
  app.get("/api/admin/users", isSuperAdmin, async (req, res) => {
    try {
      const allUsers = await db.query.users.findMany();
      
      // Don't send password back to client
      const usersWithoutPasswords = allUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Admin API for creating users with roles (super admin only)
  app.post("/api/admin/users", isSuperAdmin, async (req, res) => {
    try {
      // Validate request body with extended schema
      const createUserSchema = insertUserSchema.extend({
        roleId: z.number().min(1).max(5),
        companyName: z.string().optional(),
        agencyName: z.string().optional()
      });
      
      const userData = createUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      // Hash password
      const { scrypt, randomBytes } = await import('crypto');
      const { promisify } = await import('util');
      const scryptAsync = promisify(scrypt);
      
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(userData.password, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // If creating a hotel provider
      if (userData.roleId === USER_ROLES.HOTEL_PROVIDER && userData.companyName) {
        await storage.createHotelProvider({
          userId: user.id,
          companyName: userData.companyName,
          companyAddress: req.body.companyAddress,
          companyPhone: req.body.companyPhone,
          contactPerson: req.body.contactPerson || user.fullName,
          companyEmail: req.body.companyEmail || user.email,
          website: req.body.website,
          logo: req.body.logo,
          commission: req.body.commission,
        });
      }
      
      // If creating a travel agent
      if (userData.roleId === USER_ROLES.TRAVEL_AGENT && userData.agencyName) {
        await storage.createTravelAgent({
          userId: user.id,
          agencyName: userData.agencyName,
          agencyAddress: req.body.agencyAddress,
          agencyPhone: req.body.agencyPhone,
          contactPerson: req.body.contactPerson || user.fullName,
          agencyEmail: req.body.agencyEmail || user.email,
          website: req.body.website,
          logo: req.body.logo,
          commission: req.body.commission,
        });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
