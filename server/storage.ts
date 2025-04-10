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
import { db } from "./db";
import { eq, like, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return db.select().from(destinations);
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }

  async getFeaturedDestinations(limit: number): Promise<Destination[]> {
    return db.select().from(destinations).limit(limit);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    return db.select().from(destinations).where(
      or(
        like(destinations.name, `%${query}%`),
        like(destinations.country, `%${query}%`)
      )
    );
  }

  // Hotel operations
  async getHotels(): Promise<Hotel[]> {
    return db.select().from(hotels);
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel;
  }

  async getHotelsByDestination(destinationId: number): Promise<Hotel[]> {
    return db.select().from(hotels).where(eq(hotels.destinationId, destinationId));
  }

  async getFeaturedHotels(limit: number): Promise<Hotel[]> {
    return db.select().from(hotels).where(eq(hotels.featured, true)).limit(limit);
  }

  async searchHotels(query: string): Promise<Hotel[]> {
    return db.select().from(hotels).where(
      or(
        like(hotels.name, `%${query}%`),
        like(hotels.description, `%${query}%`)
      )
    );
  }

  // Tour operations
  async getTours(): Promise<Tour[]> {
    return db.select().from(tours);
  }

  async getTour(id: number): Promise<Tour | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    return tour;
  }

  async getToursByDestination(destinationId: number): Promise<Tour[]> {
    return db.select().from(tours).where(eq(tours.destinationId, destinationId));
  }

  async getFeaturedTours(limit: number): Promise<Tour[]> {
    return db.select().from(tours).where(eq(tours.featured, true)).limit(limit);
  }

  async searchTours(query: string): Promise<Tour[]> {
    return db.select().from(tours).where(
      or(
        like(tours.name, `%${query}%`),
        like(tours.description, `%${query}%`)
      )
    );
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    return db.select().from(packages);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async getPackagesByDestination(destinationId: number): Promise<Package[]> {
    return db.select().from(packages).where(eq(packages.destinationId, destinationId));
  }

  async getFeaturedPackages(limit: number): Promise<Package[]> {
    return db.select().from(packages).where(eq(packages.featured, true)).limit(limit);
  }

  async searchPackages(query: string): Promise<Package[]> {
    return db.select().from(packages).where(
      or(
        like(packages.name, `%${query}%`),
        like(packages.description, `%${query}%`)
      )
    );
  }

  // Special offers operations
  async getSpecialOffers(limit: number): Promise<SpecialOffer[]> {
    return db.select().from(specialOffers).limit(limit);
  }

  // Testimonial operations
  async getTestimonials(limit: number): Promise<Testimonial[]> {
    return db.select().from(testimonials).limit(limit);
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [createdBooking] = await db.insert(bookings).values(booking).returning();
    return createdBooking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
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
    
    // Add sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample destinations
    const sampleDestinations: Omit<Destination, 'id'>[] = [
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
      this.destinations.set(id, { ...dest, id });
    });

    // Add sample hotels
    const sampleHotels: Omit<Hotel, 'id'>[] = [
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
      this.hotels.set(id, { ...hotel, id });
    });

    // Add sample tours
    const sampleTours: Omit<Tour, 'id'>[] = [
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
      this.tours.set(id, { ...tour, id });
    });

    // Add sample packages
    const samplePackages: Omit<Package, 'id'>[] = [
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
      this.packages.set(id, { ...pkg, id });
    });

    // Add sample special offers
    const sampleSpecialOffers: Omit<SpecialOffer, 'id'>[] = [
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
      this.specialOffers.set(id, { ...offer, id });
    });

    // Add sample testimonials
    const sampleTestimonials: Omit<Testimonial, 'id'>[] = [
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
      this.testimonials.set(id, { ...testimonial, id });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdUser: User = { 
      ...user, 
      id, 
      fullName: user.fullName ?? null,
      createdAt: new Date(),
      phone: null,
      roleId: user.roleId ?? 1, // Default to regular user if not specified
      isActive: true,
      isEmailVerified: false,
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

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async getFeaturedDestinations(limit: number): Promise<Destination[]> {
    return Array.from(this.destinations.values()).slice(0, limit);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.destinations.values()).filter(
      dest => dest.name.toLowerCase().includes(lowercaseQuery) || dest.country.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Hotel operations
  async getHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async getHotelsByDestination(destinationId: number): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).filter(hotel => hotel.destinationId === destinationId);
  }

  async getFeaturedHotels(limit: number): Promise<Hotel[]> {
    return Array.from(this.hotels.values())
      .filter(hotel => hotel.featured)
      .slice(0, limit);
  }

  async searchHotels(query: string): Promise<Hotel[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.hotels.values()).filter(
      hotel => hotel.name.toLowerCase().includes(lowercaseQuery) || hotel.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Tour operations
  async getTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async getToursByDestination(destinationId: number): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.destinationId === destinationId);
  }

  async getFeaturedTours(limit: number): Promise<Tour[]> {
    return Array.from(this.tours.values())
      .filter(tour => tour.featured)
      .slice(0, limit);
  }

  async searchTours(query: string): Promise<Tour[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tours.values()).filter(
      tour => tour.name.toLowerCase().includes(lowercaseQuery) || tour.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPackagesByDestination(destinationId: number): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(pkg => pkg.destinationId === destinationId);
  }

  async getFeaturedPackages(limit: number): Promise<Package[]> {
    return Array.from(this.packages.values())
      .filter(pkg => pkg.featured)
      .slice(0, limit);
  }

  async searchPackages(query: string): Promise<Package[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.packages.values()).filter(
      pkg => pkg.name.toLowerCase().includes(lowercaseQuery) || pkg.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Special offers operations
  async getSpecialOffers(limit: number): Promise<SpecialOffer[]> {
    return Array.from(this.specialOffers.values()).slice(0, limit);
  }

  // Testimonial operations
  async getTestimonials(limit: number): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).slice(0, limit);
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const createdBooking: Booking = { 
      ...booking, 
      id, 
      status: booking.status ?? null,
      guests: booking.guests ?? 1,
      createdAt: new Date() 
    };
    this.bookings.set(id, createdBooking);
    return createdBooking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

// Use DatabaseStorage for production database
export const storage = new DatabaseStorage();
