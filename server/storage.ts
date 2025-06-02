// storage.ts

import {
  users, type User, type InsertUser,
  destinations, type Destination, type InsertDestination,
  hotels, type Hotel, type InsertHotel,
  tours, type Tour, type InsertTour,
  packages, type Package, type InsertPackage,
  specialOffers, type SpecialOffer, type InsertSpecialOffer,
  testimonials, type Testimonial, type InsertTestimonial,
  bookings, type Booking, type InsertBooking
} from "@shared/schema";
import { db, pool } from "./supabase-db"; // Assuming db is your Drizzle instance
import { eq, like, and, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

// IStorage interface is correct now


export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByAuthId(authUserId: string): Promise<User | undefined>; // Correctly added here
  createUser(user: InsertUser): Promise<User>;

  // ... rest of IStorage interface ...

  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  // Session store for authentication
  sessionStore: session.Store;

  constructor() {
    // Use the real Postgres session store
    this.sessionStore = new PostgresSessionStore({
      pool, // Use the pool from your supabase-db file
      createTableIfMissing: true // connect-pg-simple can create the table if it doesn't exist
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    console.log(`[Storage:DB] Querying DB for user by ID: ${id}`);
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1); // Added limit(1) for clarity
    return user;
  }

  // *** FIX HERE: Remove 'function' keyword to make it a class method ***
  async getUserByAuthId(authUserId: string): Promise<User | undefined> {
    console.log(`[Storage:DB] Querying DB for user with Auth ID: ${authUserId}`);
    // --- UNCOMMENT AND REPLACE WITH YOUR ACTUAL DB QUERY ---
    // The Drizzle query you had was likely correct, just need to fix the function syntax
    const [user] = await db.select().from(users).where(eq(users.authUserId, authUserId)).limit(1);
    console.log(`[Storage:DB] Found user for Auth ID ${authUserId}: ${user ? user.id : 'none'}`);
    return user;
    // -------------------------------------------------------
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`[Storage:DB] Querying DB for user by username: ${username}`);
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1); // Added limit(1)
    console.log(`[Storage:DB] Found user for username ${username}: ${user ? user.id : 'none'}`);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`[Storage:DB] Querying DB for user by email: ${email}`);
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1); // Added limit(1)
     console.log(`[Storage:DB] Found user for email ${email}: ${user ? user.id : 'none'}`);
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    console.log(`[Storage:DB] Creating user with email: ${user.email}`);
    // You might need to ensure required fields like createdAt, updatedAt are set here
    // or in your schema definition with defaults
    const userToInsert: InsertUser = {
        ...user,
        // Add defaults if your InsertUser or schema requires them
        // createdAt: user.createdAt ?? new Date(),
        // updatedAt: user.updatedAt ?? new Date(),
        // isActive: user.isActive ?? true,
        // isEmailVerified: user.isEmailVerified ?? false,
        // Add other default values for nullable fields if necessary
    };
    const [createdUser] = await db.insert(users).values(userToInsert).returning(); // Assuming returning() gives the inserted row
     console.log(`[Storage:DB] Created user with DB ID ${createdUser.id} and Auth ID ${createdUser.authUserId}`);
    return createdUser;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
     console.log(`[Storage:DB] Getting all destinations`);
    return db.select().from(destinations);
  }

  async getDestination(id: number): Promise<Destination | undefined> {
     console.log(`[Storage:DB] Getting destination by ID: ${id}`);
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
    return destination;
  }

  async getFeaturedDestinations(limit: number): Promise<Destination[]> {
     console.log(`[Storage:DB] Getting ${limit} featured destinations`);
    // Assuming you have a 'featured' column, or just returning a limit for now
    return db.select().from(destinations).limit(limit);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
     console.log(`[Storage:DB] Searching destinations for: ${query}`);
    const searchLike = `%${query}%`;
    return db.select().from(destinations).where(
      or(
        like(destinations.name, searchLike),
        like(destinations.country, searchLike)
      )
    );
  }

  // Hotel operations (rest of your implementations)
  // ... (Keep your existing methods for hotels, tours, packages, offers, testimonials, bookings) ...
   async getHotels(): Promise<Hotel[]> { /* ... */ return []; } // Placeholder
   async getHotel(id: number): Promise<Hotel | undefined> { /* ... */ return undefined; } // Placeholder
   async getHotelsByDestination(destinationId: number): Promise<Hotel[]> { /* ... */ return []; } // Placeholder
   async getFeaturedHotels(limit: number): Promise<Hotel[]> { /* ... */ return []; } // Placeholder
   async searchHotels(query: string): Promise<Hotel[]> { /* ... */ return []; } // Placeholder

   async getTours(): Promise<Tour[]> { /* ... */ return []; } // Placeholder
   async getTour(id: number): Promise<Tour | undefined> { /* ... */ return undefined; } // Placeholder
   async getToursByDestination(destinationId: number): Promise<Tour[]> { /* ... */ return []; } // Placeholder
   async getFeaturedTours(limit: number): Promise<Tour[]> { /* ... */ return []; } // Placeholder
   async searchTours(query: string): Promise<Tour[]> { /* ... */ return []; } // Placeholder

    async getPackages(): Promise<Package[]> { /* ... */ return []; } // Placeholder
    async getPackage(id: number): Promise<Package | undefined> { /* ... */ return undefined; } // Placeholder
    async getPackagesByDestination(destinationId: number): Promise<Package[]> { /* ... */ return []; } // Placeholder
    async getFeaturedPackages(limit: number): Promise<Package[]> { /* ... */ return []; } // Placeholder
    async searchPackages(query: string): Promise<Package[]> { /* ... */ return []; } // Placeholder

     async getSpecialOffers(limit: number): Promise<SpecialOffer[]> { /* ... */ return []; } // Placeholder

     async getTestimonials(limit: number): Promise<Testimonial[]> { /* ... */ return []; } // Placeholder

     async createBooking(booking: InsertBooking): Promise<Booking> { /* ... */ throw new Error("Not implemented"); } // Placeholder
     async getUserBookings(userId: number): Promise<Booking[]> { /* ... */ return []; } // Placeholder
     async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> { /* ... */ return undefined; } // Placeholder


}


// In-memory storage (keep this if you might use it for testing)
export class MemStorage implements IStorage {
  // ... (Keep your existing MemStorage properties) ...
   private users: Map<number, User>;
   // ... rest of properties ...

  // Session store for authentication
  sessionStore: session.Store;

  // ... rest of MemStorage properties and constructor ...
   private currentUserId = 1;
    private currentDestinationId = 1;
   // ... etc ...


  constructor() {
      // ... (Keep your existing constructor logic) ...
       this.users = new Map();
        this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
        this.initializeSampleData(); // Call the initializer
  }

   // Keep initializeSampleData

  private initializeSampleData() {
      // ... (Keep your sample data initialization) ...
       // Add sample user data for testing MemStorage login/registration
       const sampleUser: User = {
           id: this.currentUserId++,
           authUserId: 'f37ca34a-f030-436d-a851-f9518fd15ff4', // Matches the ID from your log
           email: 'raymundnilo1115@gmail.com',
           username: 'raymundnilo', // Or some dummy username
           password: '$2a$10$...', // Add a bcrypt hashed password if testing password login directly
           fullName: 'Raymund Nilo',
           roleId: 4, // Assuming 4 is user role
           isActive: true,
           isEmailVerified: true, // Set to true for successful login test
           isPhoneVerified: false,
           phone: null,
           lastLogin: new Date(),
           createdAt: new Date(),
           updatedAt: new Date(),
           resetToken: null,
           resetTokenExpiry: null,
           verificationToken: null,
           profileImage: null
       };
       this.users.set(sampleUser.id, sampleUser);
        console.log(`[Storage:Mem] Added dummy user to MemStorage: ID ${sampleUser.id}, Auth ID ${sampleUser.authUserId}`);
  }


  // User operations for MemStorage
  async getUser(id: number): Promise<User | undefined> {
     console.log(`[Storage:Mem] Getting user by ID: ${id}`);
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
     console.log(`[Storage:Mem] Getting user by username: ${username}`);
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
     console.log(`[Storage:Mem] Getting user by email: ${email}`);
    const user = Array.from(this.users.values()).find(user => user.email === email);
    console.log('[Storage:Mem] getUserByEmail lookup:', { email, found: !!user, userCount: this.users.size });
    return user;
  }

  // *** FIX HERE: Add the getUserByAuthId method to MemStorage ***
   async getUserByAuthId(authUserId: string): Promise<User | undefined> {
     console.log(`[Storage:Mem] Getting user by Auth ID: ${authUserId}`);
     const user = Array.from(this.users.values()).find(user => user.authUserId === authUserId);
      console.log(`[Storage:Mem] Found user for Auth ID ${authUserId}: ${user ? user.id : 'none'}`);
     return user;
   }


  async createUser(user: InsertUser): Promise<User> {
     console.log(`[Storage:Mem] Creating user with email: ${user.email}`);
    const id = this.currentUserId++;
    const createdUser: User = {
      ...user,
      id,
      fullName: user.fullName ?? null,
      createdAt: new Date(),
      phone: null,
      roleId: user.roleId ?? 1, // Default to regular user if not specified
      isActive: true,
      isEmailVerified: false, // Default to false for MemStorage signup unless explicitly set
      isPhoneVerified: false,
      lastLogin: null,
      resetToken: null,
      resetTokenExpiry: null,
      verificationToken: null,
      profileImage: null
    };
    this.users.set(id, createdUser);
    return createdUser;
  }

  // ... rest of your MemStorage implementations ...
  // You'll need to implement the methods for destinations, hotels, etc.
  // if you intend to use MemStorage for those operations too.
  // Otherwise, MemStorage is only partially implementing IStorage.
   async getDestinations(): Promise<Destination[]> { console.warn("[Storage:Mem] getDestinations not fully implemented"); return Array.from(this.destinations.values()); }
   async getDestination(id: number): Promise<Destination | undefined> { console.warn("[Storage:Mem] getDestination not fully implemented"); return this.destinations.get(id); }
   async getFeaturedDestinations(limit: number): Promise<Destination[]> { console.warn("[Storage:Mem] getFeaturedDestinations not fully implemented"); return Array.from(this.destinations.values()).slice(0, limit); }
   async searchDestinations(query: string): Promise<Destination[]> { console.warn("[Storage:Mem] searchDestinations not fully implemented"); return []; }

    async getHotels(): Promise<Hotel[]> { console.warn("[Storage:Mem] getHotels not fully implemented"); return Array.from(this.hotels.values()); }
    async getHotel(id: number): Promise<Hotel | undefined> { console.warn("[Storage:Mem] getHotel not fully implemented"); return this.hotels.get(id); }
    async getHotelsByDestination(destinationId: number): Promise<Hotel[]> { console.warn("[Storage:Mem] getHotelsByDestination not fully implemented"); return Array.from(this.hotels.values()).filter(h => h.destinationId === destinationId); }
    async getFeaturedHotels(limit: number): Promise<Hotel[]> { console.warn("[Storage:Mem] getFeaturedHotels not fully implemented"); return Array.from(this.hotels.values()).filter(h => h.featured).slice(0, limit); }
    async searchHotels(query: string): Promise<Hotel[]> { console.warn("[Storage:Mem] searchHotels not fully implemented"); return []; }

    async getTours(): Promise<Tour[]> { console.warn("[Storage:Mem] getTours not fully implemented"); return Array.from(this.tours.values()); }
    async getTour(id: number): Promise<Tour | undefined> { console.warn("[Storage:Mem] getTour not fully implemented"); return this.tours.get(id); }
    async getToursByDestination(destinationId: number): Promise<Tour[]> { console.warn("[Storage:Mem] getToursByDestination not fully implemented"); return Array.from(this.tours.values()).filter(t => t.destinationId === destinationId); }
    async getFeaturedTours(limit: number): Promise<Tour[]> { console.warn("[Storage:Mem] getFeaturedTours not fully implemented"); return Array.from(this.tours.values()).filter(t => t.featured).slice(0, limit); }
    async searchTours(query: string): Promise<Tour[]> { console.warn("[Storage:Mem] searchTours not fully implemented"); return []; }

     async getPackages(): Promise<Package[]> { console.warn("[Storage:Mem] getPackages not fully implemented"); return Array.from(this.packages.values()); }
     async getPackage(id: number): Promise<Package | undefined> { console.warn("[Storage:Mem] getPackage not fully implemented"); return this.packages.get(id); }
     async getPackagesByDestination(destinationId: number): Promise<Package[]> { console.warn("[Storage:Mem] getPackagesByDestination not fully implemented"); return Array.from(this.packages.values()).filter(p => p.destinationId === destinationId); }
     async getFeaturedPackages(limit: number): Promise<Package[]> { console.warn("[Storage:Mem] getFeaturedPackages not fully implemented"); return Array.from(this.packages.values()).filter(p => p.featured).slice(0, limit); }
     async searchPackages(query: string): Promise<Package[]> { console.warn("[Storage:Mem] searchPackages not fully implemented"); return []; }

      async getSpecialOffers(limit: number): Promise<SpecialOffer[]> { console.warn("[Storage:Mem] getSpecialOffers not fully implemented"); return Array.from(this.specialOffers.values()).slice(0, limit); }

      async getTestimonials(limit: number): Promise<Testimonial[]> { console.warn("[Storage:Mem] getTestimonials not fully implemented"); return Array.from(this.testimonials.values()).slice(0, limit); }

      async createBooking(booking: InsertBooking): Promise<Booking> { console.warn("[Storage:Mem] createBooking not fully implemented"); throw new Error("Not implemented in MemStorage"); }
      async getUserBookings(userId: number): Promise<Booking[]> { console.warn("[Storage:Mem] getUserBookings not fully implemented"); return Array.from(this.bookings.values()).filter(b => b.userId === userId); }
      async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> { console.warn("[Storage:Mem] updateBookingStatus not fully implemented"); return undefined; }

}

// Use the appropriate storage implementation
// export const storage = new MemStorage(); // Uncomment this line to use in-memory storage for testing
export const storage = new DatabaseStorage(); // Use this when ready for DB