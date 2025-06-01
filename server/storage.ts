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
import { db, pool } from "./supabase-db"; // Assuming db is Drizzle instance, pool is pg.Pool
import { eq, like, and, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>; // Corrected: Takes number
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByAuthId(authUserId: string): Promise<User | undefined>; // Added: For lookup by Supabase Auth ID
  createUser(user: InsertUser): Promise<User>;

  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  getFeaturedDestinations(limit: number): Promise<Destination[]>;
  searchDestinations(query: string): Promise<Destination[]>;

  // Hotel operations
  getHotels(): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  getHotelsByDestination(destinationId: number): Promise<Hotel[]>;
  getFeaturedHotels(limit: number): Promise<Hotel[]>;
  searchHotels(query: string): Promise<Hotel[]>;

  // Tour operations
  getTours(): Promise<Tour[]>;
  getTour(id: number): Promise<Tour | undefined>;
  getToursByDestination(destinationId: number): Promise<Tour[]>;
  getFeaturedTours(limit: number): Promise<Tour[]>;
  searchTours(query: string): Promise<Tour[]>;

  // Package operations
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  getPackagesByDestination(destinationId: number): Promise<Package[]>;
  getFeaturedPackages(limit: number): Promise<Package[]>;
  searchPackages(query: string): Promise<Package[]>;

  // Special offers operations
  getSpecialOffers(limit: number): Promise<SpecialOffer[]>;

  // Testimonial operations
  getTestimonials(limit: number): Promise<Testimonial[]>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;

  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  // Session store for authentication
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    // Fetch user by primary key (numeric ID)
    console.log(`[DatabaseStorage] Fetching user by ID: ${id}`);
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`[DatabaseStorage] Fetching user by username: ${username}`);
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`[DatabaseStorage] Fetching user by email: ${email}`);
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async getUserByAuthId(authUserId: string): Promise<User | undefined> {
    // Added: Fetch user by Supabase Auth UUID
    console.log(`[DatabaseStorage] Fetching user by Auth ID: ${authUserId}`);
    const [user] = await db.select().from(users).where(eq(users.authUserId, authUserId)).limit(1);
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    console.log(`[DatabaseStorage] Creating user: ${user.email} (${user.username})`);
    // Ensure returning() gets the created user object including the generated ID
    const [createdUser] = await db.insert(users).values(user).returning();
     if (!createdUser) {
        throw new Error("Failed to retrieve created user after insertion");
     }
    return createdUser;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
     console.log('[DatabaseStorage] Fetching all destinations');
    return db.select().from(destinations);
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    console.log(`[DatabaseStorage] Fetching destination by ID: ${id}`);
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
    return destination;
  }

  async getFeaturedDestinations(limit: number): Promise<Destination[]> {
    console.log(`[DatabaseStorage] Fetching ${limit} featured destinations`);
     // Note: Your schema doesn't show a 'featured' column for destinations.
     // This implementation just limits results. Adjust if you have a 'featured' flag.
    return db.select().from(destinations).limit(limit);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    console.log(`[DatabaseStorage] Searching destinations: "${query}"`);
    return db.select().from(destinations).where(
      or(
        like(destinations.name, `%${query}%`),
        like(destinations.country, `%${query}%`)
      )
    );
  }

  // Hotel operations
  async getHotels(): Promise<Hotel[]> {
    console.log('[DatabaseStorage] Fetching all hotels');
    return db.select().from(hotels);
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    console.log(`[DatabaseStorage] Fetching hotel by ID: ${id}`);
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1);
    return hotel;
  }

  async getHotelsByDestination(destinationId: number): Promise<Hotel[]> {
    console.log(`[DatabaseStorage] Fetching hotels for destination ID: ${destinationId}`);
    return db.select().from(hotels).where(eq(hotels.destinationId, destinationId));
  }

  async getFeaturedHotels(limit: number): Promise<Hotel[]> {
    console.log(`[DatabaseStorage] Fetching ${limit} featured hotels`);
    return db.select().from(hotels).where(eq(hotels.featured, true)).limit(limit);
  }

  async searchHotels(query: string): Promise<Hotel[]> {
     console.log(`[DatabaseStorage] Searching hotels: "${query}"`);
    return db.select().from(hotels).where(
      or(
        like(hotels.name, `%${query}%`),
        like(hotels.description, `%${query}%`)
      )
    );
  }

  // Tour operations
  async getTours(): Promise<Tour[]> {
     console.log('[DatabaseStorage] Fetching all tours');
    return db.select().from(tours);
  }

  async getTour(id: number): Promise<Tour | undefined> {
    console.log(`[DatabaseStorage] Fetching tour by ID: ${id}`);
    const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
    return tour;
  }

  async getToursByDestination(destinationId: number): Promise<Tour[]> {
    console.log(`[DatabaseStorage] Fetching tours for destination ID: ${destinationId}`);
    return db.select().from(tours).where(eq(tours.destinationId, destinationId));
  }

  async getFeaturedTours(limit: number): Promise<Tour[]> {
     console.log(`[DatabaseStorage] Fetching ${limit} featured tours`);
    return db.select().from(tours).where(eq(tours.featured, true)).limit(limit);
  }

  async searchTours(query: string): Promise<Tour[]> {
     console.log(`[DatabaseStorage] Searching tours: "${query}"`);
    return db.select().from(tours).where(
      or(
        like(tours.name, `%${query}%`),
        like(tours.description, `%${query}%`)
      )
    );
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    console.log('[DatabaseStorage] Fetching all packages');
    return db.select().from(packages);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    console.log(`[DatabaseStorage] Fetching package by ID: ${id}`);
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
    return pkg;
  }

  async getPackagesByDestination(destinationId: number): Promise<Package[]> {
    console.log(`[DatabaseStorage] Fetching packages for destination ID: ${destinationId}`);
    return db.select().from(packages).where(eq(packages.destinationId, destinationId));
  }

  async getFeaturedPackages(limit: number): Promise<Package[]> {
     console.log(`[DatabaseStorage] Fetching ${limit} featured packages`);
    return db.select().from(packages).where(eq(packages.featured, true)).limit(limit);
  }

  async searchPackages(query: string): Promise<Package[]> {
     console.log(`[DatabaseStorage] Searching packages: "${query}"`);
    return db.select().from(packages).where(
      or(
        like(packages.name, `%${query}%`),
        like(packages.description, `%${query}%`)
      )
    );
  }

  // Special offers operations
  async getSpecialOffers(limit: number): Promise<SpecialOffer[]> {
     console.log(`[DatabaseStorage] Fetching ${limit} special offers`);
    return db.select().from(specialOffers).limit(limit);
  }

  // Testimonial operations
  async getTestimonials(limit: number): Promise<Testimonial[]> {
     console.log(`[DatabaseStorage] Fetching ${limit} testimonials`);
    return db.select().from(testimonials).limit(limit);
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
     console.log(`[DatabaseStorage] Creating booking for user ${booking.userId}`);
    const [createdBooking] = await db.insert(bookings).values(booking).returning();
     if (!createdBooking) {
         throw new Error("Failed to retrieve created booking after insertion");
     }
    return createdBooking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
     console.log(`[DatabaseStorage] Fetching bookings for user ID: ${userId}`);
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
     console.log(`[DatabaseStorage] Updating booking ${id} status to "${status}"`);
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }
}

// For development, use in-memory storage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private hotels: Map<number, Hotel>;
  private tours: Map<number, Tour>;
  private packages: Map<number, Package>;
  private specialOffers: Map<number, SpecialOffer>;
  private testimonials: Map<number, Testimonial>;
  private bookings: Map<number, Booking>;

  // Session store for authentication
  sessionStore: session.Store;

  private currentUserId = 1;
  private currentDestinationId = 1;
  private currentHotelId = 1;
  private currentTourId = 1;
  private currentPackageId = 1;
  private currentSpecialOfferId = 1;
  private currentTestimonialId = 1;
  private currentBookingId = 1;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.hotels = new Map();
    this.tours = new Map();
    this.packages = new Map();
    this.specialOffers = new Map();
    this.testimonials = new Map();
    this.bookings = new Map();

    // Create an in-memory session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Add sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample destinations
    const sampleDestinations: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Bali',
        country: 'Indonesia',
        description: 'Tropical paradise with beautiful beaches and rich culture',
        imageUrl: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713',
        rating: 4.8,
        reviewCount: 2456
      },
      {
        name: 'Santorini',
        country: 'Greece',
        description: 'Stunning island with white buildings and blue domes',
        imageUrl: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216',
        rating: 4.9,
        reviewCount: 3210
      },
      {
        name: 'Kyoto',
        country: 'Japan',
        description: 'Ancient city with beautiful temples and traditional gardens',
        imageUrl: 'https://images.unsplash.com/photo-1543249037-d517e66dab50',
        rating: 4.7,
        reviewCount: 1876
      }
    ];

    sampleDestinations.forEach(dest => {
      const id = this.currentDestinationId++;
      this.destinations.set(id, { ...dest, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Add sample hotels
    const sampleHotels: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'The Grand Riviera',
        destinationId: 1,
        description: 'Luxury hotel with stunning ocean views',
        address: '123 Beach Road, Monaco',
        price: 420,
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        rating: 5.0,
        reviewCount: 523,
        amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant'],
        featured: true
      },
      {
        name: 'Tropical Paradise Resort',
        destinationId: 1,
        description: 'Beautiful resort surrounded by tropical gardens',
        address: 'Paradise Beach, Maldives',
        price: 380,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        rating: 4.5,
        reviewCount: 412,
        amenities: ['Pool', 'Private Beach', 'WiFi', 'Bar'],
        featured: true
      },
      {
        name: 'Mountain View Lodge',
        destinationId: 3,
        description: 'Cozy lodge with breathtaking mountain views',
        address: 'Alpine Road, Swiss Alps',
        price: 290,
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        rating: 4.0,
        reviewCount: 287,
        amenities: ['Fireplace', 'Sauna', 'Restaurant'],
        featured: true
      },
      {
        name: 'Urban Boutique Hotel',
        destinationId: 2,
        description: 'Stylish hotel in the heart of the city',
        address: '42 Central Park, New York',
        price: 350,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        rating: 4.0,
        reviewCount: 345,
        amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar'],
        featured: true
      }
    ];

    sampleHotels.forEach(hotel => {
      const id = this.currentHotelId++;
      this.hotels.set(id, { ...hotel, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Add sample tours
    const sampleTours: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Ancient Temples Guided Tour',
        destinationId: 3,
        description: 'Explore the ancient temples with an expert archaeologist guide. Includes transportation and lunch.',
        duration: '8 hours',
        price: 89,
        imageUrl: 'https://images.unsplash.com/photo-1549221987-25a490f65d34',
        rating: 4.5,
        reviewCount: 124,
        inclusions: ['Expert Guide', 'Transportation', 'Lunch', 'Entrance Fees'],
        groupSize: 'Small group',
        featured: true
      },
      {
        name: 'Sunset Sailing Adventure',
        destinationId: 1,
        description: 'Enjoy a beautiful sunset aboard a luxury catamaran with drinks, snacks, and swimming stops.',
        duration: '3 hours',
        price: 65,
        imageUrl: 'https://images.unsplash.com/photo-1605908584126-8a581aed37b3',
        rating: 5.0,
        reviewCount: 98,
        inclusions: ['Drinks', 'Snacks', 'Swimming', 'Professional Crew'],
        groupSize: 'Small group',
        featured: true
      },
      {
        name: 'Culinary Walking Tour',
        destinationId: 2,
        description: 'Sample local delicacies at hidden gems with a professional food guide. Includes all tastings.',
        duration: '4 hours',
        price: 75,
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        rating: 4.0,
        reviewCount: 56,
        inclusions: ['Professional Guide', 'Food Tastings', 'Beverage Tastings'],
        groupSize: 'Small group',
        featured: true
      }
    ];

    sampleTours.forEach(tour => {
      const id = this.currentTourId++;
      this.tours.set(id, { ...tour, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Add sample packages
    const samplePackages: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Tropical Paradise Escape',
        description: '7 days of tropical bliss with beachfront accommodation, island hopping tours, sunset cruise, and all meals included.',
        destinationId: 1,
        duration: '7 days',
        price: 2499,
        discountedPrice: 1999,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        rating: 4.5,
        reviewCount: 234,
        highlights: ['5-star Resort', 'All-inclusive', '3 Tours'],
        inclusions: ['Accommodation', 'All Meals', 'Tours', 'Airport Transfers'],
        isBestseller: true,
        discountPercentage: 20,
        featured: true
      },
      {
        name: 'European City Explorer',
        description: '10-day journey through 3 iconic European cities with boutique hotels, guided tours, and train transportation between destinations.',
        destinationId: 2,
        duration: '10 days',
        price: 3299,
        discountedPrice: 2969,
        imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
        rating: 4.0,
        reviewCount: 187,
        highlights: ['Boutique Hotels', 'Guided Tours', 'Rail Passes'],
        inclusions: ['Accommodation', 'Breakfast', 'Tours', 'Train Tickets'],
        isBestseller: false,
        discountPercentage: 10,
        featured: true
      }
    ];

    samplePackages.forEach(pkg => {
      const id = this.currentPackageId++;
      this.packages.set(id, { ...pkg, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Add sample special offers
    const sampleSpecialOffers: Omit<SpecialOffer, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: '5-Night Luxury Beachfront Resort',
        description: 'Enjoy a luxurious stay at our exclusive beachfront property with complimentary breakfast and spa access.',
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
        originalPrice: 1200,
        discountedPrice: 960,
        discountPercentage: 20,
        badge: '20% OFF',
        priceUnit: 'person'
      },
      {
        title: 'Urban Explorer City Break Package',
        description: '3-day city exploration with guided tours, luxury accommodations, and exclusive restaurant reservations.',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
        originalPrice: 850,
        discountedPrice: 680,
        discountPercentage: 20,
        badge: 'HOT DEAL',
        priceUnit: 'person'
      },
      {
        title: 'All-Inclusive Safari Adventure',
        description: '7-day safari experience with expert guides, luxury tented camps, and all meals and activities included.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        originalPrice: 3200,
        discountedPrice: 2720,
        discountPercentage: 15,
        badge: '15% OFF',
        priceUnit: 'person'
      }
    ];

    sampleSpecialOffers.forEach(offer => {
      const id = this.currentSpecialOfferId++;
      this.specialOffers.set(id, { ...offer, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Add sample testimonials
    const sampleTestimonials: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        content: "The Bali package was absolutely amazing! Everything was well-organized, from the airport pickup to the tours. The hotel was beautiful and the staff was incredibly friendly. Would book again in a heartbeat!",
        authorName: "Sarah J.",
        authorImage: "https://randomuser.me/api/portraits/women/34.jpg",
        rating: 5,
        productName: "Bali Luxury Retreat"
      },
      {
        content: "Our European tour exceeded all expectations. The boutique hotels were charming and perfectly located. The guided tours gave us insights we would have never discovered on our own. Wanderlust made our dream trip a reality!",
        authorName: "David & Maria L.",
        authorImage: "https://randomuser.me/api/portraits/men/46.jpg",
        rating: 5,
        productName: "European Adventure Package"
      },
      {
        content: "The Wanderlust team went above and beyond when our flight was delayed. They rearranged our entire itinerary seamlessly. The culinary tour in Thailand was the highlight - authentic and delicious experiences I'll never forget!",
        authorName: "Michelle T.",
        authorImage: "https://randomuser.me/api/portraits/women/62.jpg",
        rating: 4.5,
        productName: "Thailand Food & Culture Tour"
      }
    ];

    sampleTestimonials.forEach(testimonial => {
      const id = this.currentTestimonialId++;
      this.testimonials.set(id, { ...testimonial, id, createdAt: new Date(), updatedAt: new Date() });
    });

     // Add a sample user for MemStorage testing
     const sampleUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'resetToken' | 'resetTokenExpiry' | 'verificationToken' | 'profileImage'> = {
        email: 'testuser@example.com',
        password: 'hashedpassword', // In memory, could be anything or omit if not used
        username: 'testuser',
        fullName: 'Test User',
        roleId: 4, // user role
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        authUserId: 'some-supabase-auth-uuid-1' // Link to a dummy auth ID
     };
     const userId = this.currentUserId++;
     this.users.set(userId, {
         ...sampleUser,
         id: userId,
         createdAt: new Date(),
         updatedAt: new Date(),
         lastLogin: null,
         resetToken: null,
         resetTokenExpiry: null,
         verificationToken: null,
         profileImage: null
     });
     console.log('[MemStorage] Added sample user:', this.users.get(userId));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    console.log(`[MemStorage] Fetching user by ID: ${id}`);
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`[MemStorage] Fetching user by username: ${username}`);
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`[MemStorage] Fetching user by email: ${email}`);
    const user = Array.from(this.users.values()).find(user => user.email === email);
    console.log('[MemStorage] getUserByEmail lookup result:', { email, found: !!user, userCount: this.users.size });
    return user;
  }

  async getUserByAuthId(authUserId: string): Promise<User | undefined> {
     // Added: Fetch user by Supabase Auth UUID
     console.log(`[MemStorage] Fetching user by Auth ID: ${authUserId}`);
     return Array.from(this.users.values()).find(user => user.authUserId === authUserId);
  }


  async createUser(user: InsertUser): Promise<User> {
    console.log(`[MemStorage] Creating user: ${user.email} (${user.username})`);
    const id = this.currentUserId++;
    const createdUser: User = {
      id,
      email: user.email,
      password: user.password, // Assuming InsertUser includes password
      username: user.username,
      fullName: user.fullName ?? null,
      roleId: user.roleId ?? 4, // Default to regular user
      isActive: true,
      isEmailVerified: user.isEmailVerified ?? false, // Use provided status, default false
      isPhoneVerified: user.isPhoneVerified ?? false,
      authUserId: user.authUserId, // Assuming InsertUser includes authUserId
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      resetToken: null,
      resetTokenExpiry: null,
      verificationToken: null,
      profileImage: null
    };
     // Ensure InsertUser has all non-nullable fields or provide defaults
     // Based on your schema import, check if InsertUser matches User completely or if defaults are needed.
     // For password, if you rely solely on Supabase Auth, you might not store it here. Adjust InsertUser/User types accordingly.
    this.users.set(id, createdUser);
    console.log('[MemStorage] Created user:', createdUser);
    return createdUser;
  }

  // Destination operations (Implementations remain the same, just add console logs)
  async getDestinations(): Promise<Destination[]> {
    console.log('[MemStorage] Fetching all destinations');
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    console.log(`[MemStorage] Fetching destination by ID: ${id}`);
    return this.destinations.get(id);
  }

  async getFeaturedDestinations(limit: number): Promise<Destination[]> {
     console.log(`[MemStorage] Fetching ${limit} featured destinations`);
    return Array.from(this.destinations.values()).slice(0, limit);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    console.log(`[MemStorage] Searching destinations: "${query}"`);
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.destinations.values()).filter(
      dest => dest.name.toLowerCase().includes(lowercaseQuery) || dest.country.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Hotel operations (Implementations remain the same, just add console logs)
  async getHotels(): Promise<Hotel[]> {
     console.log('[MemStorage] Fetching all hotels');
    return Array.from(this.hotels.values());
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    console.log(`[MemStorage] Fetching hotel by ID: ${id}`);
    return this.hotels.get(id);
  }

  async getHotelsByDestination(destinationId: number): Promise<Hotel[]> {
     console.log(`[MemStorage] Fetching hotels for destination ID: ${destinationId}`);
    return Array.from(this.hotels.values()).filter(hotel => hotel.destinationId === destinationId);
  }

  async getFeaturedHotels(limit: number): Promise<Hotel[]> {
    console.log(`[MemStorage] Fetching ${limit} featured hotels`);
    return Array.from(this.hotels.values())
      .filter(hotel => hotel.featured)
      .slice(0, limit);
  }

  async searchHotels(query: string): Promise<Hotel[]> {
     console.log(`[MemStorage] Searching hotels: "${query}"`);
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.hotels.values()).filter(
      hotel => hotel.name.toLowerCase().includes(lowercaseQuery) || hotel.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Tour operations (Implementations remain the same, just add console logs)
  async getTours(): Promise<Tour[]> {
     console.log('[MemStorage] Fetching all tours');
    return Array.from(this.tours.values());
  }

  async getTour(id: number): Promise<Tour | undefined> {
    console.log(`[MemStorage] Fetching tour by ID: ${id}`);
    return this.tours.get(id);
  }

  async getToursByDestination(destinationId: number): Promise<Tour[]> {
     console.log(`[MemStorage] Fetching tours for destination ID: ${destinationId}`);
    return Array.from(this.tours.values()).filter(tour => tour.destinationId === destinationId);
  }

  async getFeaturedTours(limit: number): Promise<Tour[]> {
     console.log(`[MemStorage] Fetching ${limit} featured tours`);
    return Array.from(this.tours.values())
      .filter(tour => tour.featured)
      .slice(0, limit);
  }

  async searchTours(query: string): Promise<Tour[]> {
     console.log(`[MemStorage] Searching tours: "${query}"`);
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tours.values()).filter(
      tour => tour.name.toLowerCase().includes(lowercaseQuery) || tour.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Package operations (Implementations remain the same, just add console logs)
  async getPackages(): Promise<Package[]> {
     console.log('[MemStorage] Fetching all packages');
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    console.log(`[MemStorage] Fetching package by ID: ${id}`);
    return this.packages.get(id);
  }

  async getPackagesByDestination(destinationId: number): Promise<Package[]> {
     console.log(`[MemStorage] Fetching packages for destination ID: ${destinationId}`);
    return Array.from(this.packages.values()).filter(pkg => pkg.destinationId === destinationId);
  }

  async getFeaturedPackages(limit: number): Promise<Package[]> {
     console.log(`[MemStorage] Fetching ${limit} featured packages`);
    return Array.from(this.packages.values())
      .filter(pkg => pkg.featured)
      .slice(0, limit);
  }

  async searchPackages(query: string): Promise<Package[]> {
     console.log(`[MemStorage] Searching packages: "${query}"`);
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.packages.values()).filter(
      pkg => pkg.name.toLowerCase().includes(lowercaseQuery) || pkg.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Special offers operations (Implementations remain the same, just add console logs)
  async getSpecialOffers(limit: number): Promise<SpecialOffer[]> {
    console.log(`[MemStorage] Fetching ${limit} special offers`);
    return Array.from(this.specialOffers.values()).slice(0, limit);
  }

  // Testimonial operations (Implementations remain the same, just add console logs)
  async getTestimonials(limit: number): Promise<Testimonial[]> {
    console.log(`[MemStorage] Fetching ${limit} testimonials`);
    return Array.from(this.testimonials.values()).slice(0, limit);
  }

  // Booking operations (Implementations remain the same, just add console logs)
  async createBooking(booking: InsertBooking): Promise<Booking> {
    console.log(`[MemStorage] Creating booking for user ${booking.userId}`);
    const id = this.currentBookingId++;
    const createdBooking: Booking = {
      id,
      userId: booking.userId,
      packageId: booking.packageId ?? null, // Assume packageId is optional if not always used
      tourId: booking.tourId ?? null, // Assume tourId is optional
      hotelId: booking.hotelId ?? null, // Assume hotelId is optional
      destinationId: booking.destinationId ?? null, // Assume destinationId is optional
      bookingDate: booking.bookingDate,
      startDate: booking.startDate,
      endDate: booking.endDate,
      guests: booking.guests ?? 1,
      totalPrice: booking.totalPrice,
      status: booking.status ?? 'pending', // Default status
      createdAt: new Date(),
      updatedAt: new Date() // Assuming updatedAt is part of your schema
    };
     // Add console.log for verification
     console.log('[MemStorage] Created booking:', createdBooking);
    this.bookings.set(id, createdBooking);
    return createdBooking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
     console.log(`[MemStorage] Fetching bookings for user ID: ${userId}`);
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
     console.log(`[MemStorage] Updating booking ${id} status to "${status}"`);
    const booking = this.bookings.get(id);
    if (!booking) {
       console.log(`[MemStorage] Booking ${id} not found for status update.`);
       return undefined;
    }

    const updatedBooking = { ...booking, status, updatedAt: new Date() }; // Update timestamp
    this.bookings.set(id, updatedBooking);
    console.log('[MemStorage] Updated booking:', updatedBooking);
    return updatedBooking;
  }
}

// Use MemStorage for reliable operation without external dependencies during development
// Change to new DatabaseStorage() when connecting to a real database
export const storage = new MemStorage();
// export const storage = new DatabaseStorage(); // Use this when ready for DB