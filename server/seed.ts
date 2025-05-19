import { db } from "./db";
import {
  users,
  destinations,
  hotels,
  tours,
  packages,
  specialOffers,
  testimonials,
  bookings,
  payments,
  agentPointTransactions,
  agentRewardRedemptions,
  agentRewardPoints,
  hotelOwnership,
  agentProfiles,
  hotelOwnerProfiles,
  roles,
} from "@shared/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";

async function checkDataExists() {
  try {
    // Query to count destinations
    const result = await db.select({
      count: sql`count(*)`
    }).from(destinations);
    
    // Get the count from the result
    const count = parseInt(result[0]?.count as string || '0');
    return count > 0;
  } catch (error) {
    console.error("Error checking if data exists:", error);
    return false;
  }
}

async function clearData() {
  try {
    // Clear all existing data in the correct order to avoid foreign key constraints
    console.log("Clearing existing data...");
    // First delete data from tables with foreign keys
    await db.delete(bookings).execute();
    await db.delete(payments).execute();
    await db.delete(testimonials).execute();
    await db.delete(specialOffers).execute();
    await db.delete(agentPointTransactions).execute();
    await db.delete(agentRewardRedemptions).execute();
    await db.delete(agentRewardPoints).execute();
    await db.delete(hotelOwnership).execute();
    
    // Then delete main content
    await db.delete(packages).execute();
    await db.delete(tours).execute();
    await db.delete(hotels).execute();
    await db.delete(destinations).execute();
    
    // Then delete profiles
    await db.delete(agentProfiles).execute();
    await db.delete(hotelOwnerProfiles).execute();
    
    // Then delete users
    await db.delete(users).execute();
    
    // Finally delete roles 
    await db.delete(roles).execute();
    
    console.log("Cleared existing data");
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error; // Re-throw to stop the seeding process if clearing fails
  }
}

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Force clear and reseed with Puerto Galera data
    console.log("Clearing existing data and adding Puerto Galera content...");
    
    // Clear any existing data
    await clearData();
    
    // Setup variable to store role map
    let roleMap;
    
    // Sample roles
    const sampleRoles = [
      {
        name: 'customer',
        description: 'Regular customer role with booking privileges'
      },
      {
        name: 'hotel_owner',
        description: 'Hotel owner role with property management privileges'
      },
      {
        name: 'travel_agent',
        description: 'Travel agent role with booking and commission privileges'
      },
      {
        name: 'admin',
        description: 'Administrator role with full system access'
      }
    ];
    
    const insertedRoles = await db.insert(roles).values(sampleRoles).returning();
    console.log(`Added ${insertedRoles.length} roles`);
    
    // Create a map for roles by name for easy reference
    roleMap = new Map();
    insertedRoles.forEach(role => {
      roleMap.set(role.name, role.id);
    });
    
    // Sample destinations
    const sampleDestinations = [
      {
        name: 'White Beach',
        country: 'Philippines',
        description: 'Beautiful white sand beach in Puerto Galera, Oriental Mindoro with crystal clear waters',
        imageUrl: 'https://images.unsplash.com/photo-1589394815804-964421bf9359',
        rating: 4.9,
        reviewCount: 1850
      },
      {
        name: 'Sabang Beach',
        country: 'Philippines',
        description: 'Popular diving spot in Puerto Galera known for vibrant coral reefs and nightlife',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        rating: 4.7,
        reviewCount: 1240
      },
      {
        name: 'Talipanan Beach',
        country: 'Philippines',
        description: 'Quiet and secluded beach in Puerto Galera ideal for relaxation away from crowds',
        imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f',
        rating: 4.6,
        reviewCount: 875
      },
      {
        name: 'Aninuan Beach',
        country: 'Philippines',
        description: 'Picturesque beach with mountain views and various water activities',
        imageUrl: 'https://images.unsplash.com/photo-1468413253725-0d5181091126',
        rating: 4.5,
        reviewCount: 720
      },
      {
        name: 'Puerto Galera Town',
        country: 'Philippines',
        description: 'Charming town center with local markets, restaurants and cultural experiences',
        imageUrl: 'https://images.unsplash.com/photo-1552751753-d8be54aee3e0',
        rating: 4.3,
        reviewCount: 950
      }
    ];
    
    const insertedDestinations = await db.insert(destinations).values(sampleDestinations).returning();
    console.log(`Added ${insertedDestinations.length} destinations`);

    // Create a map for destinations by name for easy reference
    const destinationMap = new Map();
    insertedDestinations.forEach(dest => {
      destinationMap.set(dest.name, dest.id);
    });
    
    // Sample hotels
    const sampleHotels = [
      {
        name: 'White Beach Resort & Spa',
        destinationId: destinationMap.get('White Beach'),
        description: 'Luxury beachfront resort with stunning ocean views and direct access to White Beach',
        address: 'White Beach, Puerto Galera, Oriental Mindoro',
        price: 7500, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        rating: 4.8,
        reviewCount: 432,
        amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Beach Access', 'Air Conditioning'],
        featured: true
      },
      {
        name: 'Sunset View Inn',
        destinationId: destinationMap.get('White Beach'),
        description: 'Affordable beachfront accommodation with incredible sunset views',
        address: 'White Beach Central, Puerto Galera',
        price: 3500, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        rating: 4.5,
        reviewCount: 324,
        amenities: ['WiFi', 'Restaurant', 'Beach Access', 'Air Conditioning'],
        featured: true
      },
      {
        name: 'Mindoro Beachside Hotel',
        destinationId: destinationMap.get('White Beach'),
        description: 'Family-friendly hotel steps away from the shoreline with comfortable rooms',
        address: 'White Beach Path, Puerto Galera',
        price: 4200, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        rating: 4.3,
        reviewCount: 287,
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Family Rooms', 'Air Conditioning'],
        featured: true
      },
      {
        name: 'White Sand Cottage Resort',
        destinationId: destinationMap.get('White Beach'),
        description: 'Cozy cottages nestled in a tropical garden setting just minutes from the beach',
        address: 'White Beach Road, Puerto Galera',
        price: 2800, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        rating: 4.2,
        reviewCount: 195,
        amenities: ['Garden View', 'WiFi', 'Air Conditioning', 'Beach Shuttle'],
        featured: true
      },
      {
        name: 'Paradise Bay Resort',
        destinationId: destinationMap.get('White Beach'),
        description: 'Upscale resort offering private balconies with sea views and premium amenities',
        address: 'White Beach North, Puerto Galera',
        price: 6500, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
        rating: 4.7,
        reviewCount: 356,
        amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar', 'Beach Access', 'Room Service'],
        featured: true
      },
      {
        name: 'Budget Beach Hostel',
        destinationId: destinationMap.get('White Beach'),
        description: 'Affordable dormitory-style accommodation ideal for backpackers and solo travelers',
        address: 'White Beach South, Puerto Galera',
        price: 900, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
        rating: 4.0,
        reviewCount: 142,
        amenities: ['WiFi', 'Shared Kitchen', 'Lockers', 'Common Area'],
        featured: false
      },
      {
        name: 'Talipanan Beach Resort',
        destinationId: destinationMap.get('Talipanan Beach'),
        description: 'Peaceful resort on the quieter Talipanan Beach with spacious rooms',
        address: 'Talipanan Beach, Puerto Galera',
        price: 4800, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
        rating: 4.4,
        reviewCount: 178,
        amenities: ['Pool', 'WiFi', 'Restaurant', 'Beach Access', 'Air Conditioning'],
        featured: true
      },
      {
        name: 'Sabang Divers Resort',
        destinationId: destinationMap.get('Sabang Beach'),
        description: 'Specialist resort for diving enthusiasts with on-site dive center and equipment rental',
        address: 'Sabang Beach, Puerto Galera',
        price: 5200, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1582610116397-edb318620f90',
        rating: 4.6,
        reviewCount: 265,
        amenities: ['Dive Center', 'Pool', 'WiFi', 'Restaurant', 'Equipment Rental'],
        featured: true
      }
    ];
    
    const insertedHotels = await db.insert(hotels).values(sampleHotels).returning();
    console.log(`Added ${insertedHotels.length} hotels`);

    // Sample tours
    const sampleTours = [
      {
        name: 'Island Hopping Adventure',
        destinationId: destinationMap.get('White Beach'),
        description: 'Explore the beautiful islands around Puerto Galera including Coral Garden, Sand Bar, and Haligi Beach with snorkeling and lunch.',
        duration: '8 hours',
        price: 1500, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94',
        rating: 4.8,
        reviewCount: 324,
        inclusions: ['Boat Transfers', 'Snorkeling Equipment', 'Lunch', 'Entrance Fees', 'Life Vests'],
        groupSize: 'Small group',
        featured: true
      },
      {
        name: 'Scuba Diving for Beginners',
        destinationId: destinationMap.get('Sabang Beach'),
        description: 'First-time diving experience with professional instructors at Sabang Beach, one of the top diving spots in the Philippines.',
        duration: '4 hours',
        price: 2800, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        rating: 4.9,
        reviewCount: 186,
        inclusions: ['Professional Instructor', 'Complete Diving Equipment', 'Basic Training', 'Certificate'],
        groupSize: 'Small group (max 4)',
        featured: true
      },
      {
        name: 'Banana Boat Ride',
        destinationId: destinationMap.get('White Beach'),
        description: 'Experience the thrill of a banana boat ride along White Beach with friends and family. Great for all ages!',
        duration: '30 minutes',
        price: 350, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1544879444-18ecf34223dd',
        rating: 4.4,
        reviewCount: 210,
        inclusions: ['Boat Ride', 'Safety Equipment', 'Professional Guide'],
        groupSize: 'Small group (max 6)',
        featured: true
      },
      {
        name: 'Tukuran and Talipanan Falls Trekking Tour',
        destinationId: destinationMap.get('Talipanan Beach'),
        description: 'Trek through the lush jungles of Puerto Galera to discover hidden waterfalls where you can swim in natural pools.',
        duration: '6 hours',
        price: 1200, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344',
        rating: 4.7,
        reviewCount: 143,
        inclusions: ['Experienced Guide', 'Packed Lunch', 'Water', 'First Aid Kit'],
        groupSize: 'Small group',
        featured: true
      },
      {
        name: 'Sunset Sailing at White Beach',
        destinationId: destinationMap.get('White Beach'),
        description: 'Watch the stunning Puerto Galera sunset from a traditional outrigger boat (banca) with drinks and snacks.',
        duration: '2 hours',
        price: 900, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1605908584126-8a581aed37b3',
        rating: 4.9,
        reviewCount: 98,
        inclusions: ['Boat Ride', 'Drinks', 'Snacks', 'Professional Crew'],
        groupSize: 'Small group',
        featured: true
      },
      {
        name: 'ATV Mountain Adventure',
        destinationId: destinationMap.get('Aninuan Beach'),
        description: 'Ride all-terrain vehicles through scenic mountain trails with breathtaking views of Puerto Galera bay.',
        duration: '3 hours',
        price: 1800, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
        rating: 4.6,
        reviewCount: 87,
        inclusions: ['ATV Rental', 'Safety Equipment', 'Guide', 'Refreshments'],
        groupSize: 'Small group',
        featured: true
      },
      {
        name: 'Puerto Galera Cultural Tour',
        destinationId: destinationMap.get('Puerto Galera Town'),
        description: 'Visit local Mangyan villages, historical sites and the Puerto Galera Museum to learn about the rich cultural heritage.',
        duration: '4 hours',
        price: 850, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        rating: 4.3,
        reviewCount: 56,
        inclusions: ['Professional Guide', 'Museum Entrance', 'Transportation', 'Refreshments'],
        groupSize: 'Small group',
        featured: false
      },
      {
        name: 'Mangrove Kayaking Eco-Tour',
        destinationId: destinationMap.get('Puerto Galera Town'),
        description: 'Paddle through pristine mangrove forests and learn about these important ecosystems from knowledgeable guides.',
        duration: '3 hours',
        price: 750, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81',
        rating: 4.7,
        reviewCount: 92,
        inclusions: ['Kayak Rental', 'Guide', 'Refreshments', 'Safety Equipment'],
        groupSize: 'Small group',
        featured: false
      }
    ];
    
    const insertedTours = await db.insert(tours).values(sampleTours).returning();
    console.log(`Added ${insertedTours.length} tours`);

    // Sample packages
    const samplePackages = [
      {
        name: 'White Beach Weekend Getaway',
        description: '3-day escape with beachfront accommodation at White Beach Resort & Spa, island hopping tour, and sunset sailing adventure.',
        destinationId: destinationMap.get('White Beach'),
        duration: '3 days / 2 nights',
        price: 14500, // in PHP
        discountedPrice: 12500, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1589394815804-964421bf9359',
        rating: 4.8,
        reviewCount: 165,
        highlights: ['Beachfront Resort', 'Island Hopping', 'Sunset Cruise'],
        inclusions: ['Resort Accommodation', 'Daily Breakfast', '2 Tours', 'Ferry Transfers'],
        isBestseller: true,
        discountPercentage: 14,
        featured: true
      },
      {
        name: 'Puerto Galera Adventure Package',
        description: '5-day action-packed adventure with scuba diving, ATV mountain tour, and waterfall trekking. Includes hotel stay at Sabang Divers Resort.',
        destinationId: destinationMap.get('Sabang Beach'),
        duration: '5 days / 4 nights',
        price: 22500, // in PHP
        discountedPrice: 18900, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        rating: 4.7,
        reviewCount: 98,
        highlights: ['Scuba Diving', 'ATV Adventure', 'Waterfall Trek'],
        inclusions: ['Hotel Accommodation', 'Daily Breakfast', '3 Adventure Tours', 'Equipment Rental', 'Ferry Transfers'],
        isBestseller: false,
        discountPercentage: 16,
        featured: true
      },
      {
        name: 'Family Fun in Puerto Galera',
        description: '4-day family vacation with kid-friendly activities including beach games, banana boat rides, and island hopping. Stays at family-friendly Mindoro Beachside Hotel.',
        destinationId: destinationMap.get('White Beach'),
        duration: '4 days / 3 nights',
        price: 18900, // in PHP
        discountedPrice: 16500, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94',
        rating: 4.6,
        reviewCount: 123,
        highlights: ['Family Room', 'Kid-Friendly Tours', 'Beach Activities'],
        inclusions: ['Hotel Accommodation', 'Daily Breakfast', 'Banana Boat Ride', 'Island Hopping Tour', 'Ferry Transfers'],
        isBestseller: true,
        discountPercentage: 13,
        featured: true
      },
      {
        name: 'Romantic Puerto Galera Escape',
        description: '3-day romantic getaway for couples with private sunset dinner, couple\'s massage, and exclusive beach cabana at Paradise Bay Resort.',
        destinationId: destinationMap.get('White Beach'),
        duration: '3 days / 2 nights',
        price: 16900, // in PHP
        discountedPrice: 15200, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        rating: 4.9,
        reviewCount: 87,
        highlights: ['Luxury Resort', 'Couple\'s Massage', 'Private Dinner'],
        inclusions: ['Resort Accommodation', 'Daily Breakfast', 'Spa Treatment', 'Romantic Dinner', 'Ferry Transfers'],
        isBestseller: false,
        discountPercentage: 10,
        featured: true
      },
      {
        name: 'Puerto Galera Diving Discovery',
        description: '6-day comprehensive diving package with 10 dives at different sites around Puerto Galera, perfect for certified divers wanting to explore this world-class diving destination.',
        destinationId: destinationMap.get('Sabang Beach'),
        duration: '6 days / 5 nights',
        price: 28500, // in PHP
        discountedPrice: 24500, // in PHP
        imageUrl: 'https://images.unsplash.com/photo-1586152483585-eb450ec9732a',
        rating: 4.8,
        reviewCount: 156,
        highlights: ['10 Dive Package', 'Equipment Included', 'Dive Master'],
        inclusions: ['Resort Accommodation', 'Daily Breakfast', 'All Diving Equipment', 'Boat Transfers', 'Certification'],
        isBestseller: true,
        discountPercentage: 14,
        featured: true
      }
    ];
    
    const insertedPackages = await db.insert(packages).values(samplePackages).returning();
    console.log(`Added ${insertedPackages.length} packages`);

    // Sample special offers
    const sampleSpecialOffers = [
      {
        title: 'White Beach Resort Summer Special',
        description: '3-Night stay at White Beach Resort & Spa with complimentary breakfast, one spa treatment, and island hopping tour.',
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
        originalPrice: 22500, // in PHP
        discountedPrice: 18000, // in PHP
        discountPercentage: 20,
        badge: '20% OFF',
        priceUnit: 'package',
        validFrom: new Date(), // Start from today
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Valid for 90 days
      },
      {
        title: 'Weekday Diving Discovery',
        description: 'Monday to Thursday diving package with 6 dives, equipment rental, and accommodation at Sabang Divers Resort.',
        imageUrl: 'https://images.unsplash.com/photo-1586152483585-eb450ec9732a',
        originalPrice: 15000, // in PHP
        discountedPrice: 12000, // in PHP
        discountPercentage: 20,
        badge: 'HOT DEAL',
        priceUnit: 'person',
        validFrom: new Date(), // Start from today
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // Valid for 60 days
      },
      {
        title: 'Couple\'s Island Retreat',
        description: '2-night romantic getaway at Paradise Bay Resort with private candlelit dinner on the beach, couple\'s massage, and sunset cruise.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        originalPrice: 16500, // in PHP
        discountedPrice: 13200, // in PHP
        discountPercentage: 20,
        badge: 'ROMANCE PACKAGE',
        priceUnit: 'couple',
        validFrom: new Date(), // Start from today
        validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // Valid for 120 days
      },
      {
        title: 'Family Beach Fun Package',
        description: 'Family-friendly 3-night package at Mindoro Beachside Hotel with daily activities for kids, banana boat ride, and island picnic.',
        imageUrl: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94',
        originalPrice: 25000, // in PHP
        discountedPrice: 20000, // in PHP
        discountPercentage: 20,
        badge: 'FAMILY SPECIAL',
        priceUnit: 'family',
        validFrom: new Date(), // Start from today
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Valid for 90 days
      }
    ];
    
    const insertedSpecialOffers = await db.insert(specialOffers).values(sampleSpecialOffers).returning();
    console.log(`Added ${insertedSpecialOffers.length} special offers`);

    // Sample testimonials
    const sampleTestimonials = [
      {
        content: "The White Beach Weekend Getaway was perfect! Everything was well-organized from the ferry tickets to the tours. The resort was beautiful and right on the beach. The service was excellent and we loved the island hopping tour!",
        authorName: "Sarah Johnson",
        authorImage: "https://randomuser.me/api/portraits/women/12.jpg",
        rating: 5.0,
        productName: "White Beach Weekend Getaway"
      },
      {
        content: "Scuba diving in Puerto Galera was incredible! The instructor was very professional and patient with us beginners. The underwater world around Sabang Beach is breathtaking with so many colorful corals and fish.",
        authorName: "Michael Chen",
        authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
        rating: 4.5,
        productName: "Scuba Diving for Beginners"
      },
      {
        content: "The sunset sailing tour at White Beach was truly magical! The outrigger boat ride was fun, and watching the sun set over the mountains was absolutely stunning. The crew was attentive and made our anniversary special.",
        authorName: "Emily Rodriguez",
        authorImage: "https://randomuser.me/api/portraits/women/42.jpg",
        rating: 5.0,
        productName: "Sunset Sailing at White Beach"
      },
      {
        content: "Our family had an amazing time at Mindoro Beachside Hotel! The kids loved the banana boat ride and beach activities. The staff was wonderful with children and the breakfast buffet had great Filipino options.",
        authorName: "David Williams",
        authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.5,
        productName: "Family Fun in Puerto Galera"
      },
      {
        content: "Island hopping around Puerto Galera was the highlight of our trip! The beaches were pristine and snorkeling at Coral Garden was like swimming in an aquarium. Great value for the price and excellent guides.",
        authorName: "Maria Santos",
        authorImage: "https://randomuser.me/api/portraits/women/45.jpg",
        rating: 5.0,
        productName: "Island Hopping Adventure"
      }
    ];
    
    const insertedTestimonials = await db.insert(testimonials).values(sampleTestimonials).returning();
    console.log(`Added ${insertedTestimonials.length} testimonials`);

    // Add a test user
    const customerRoleId = roleMap.get('customer');
    console.log("Customer role ID:", customerRoleId);
    
    if (!customerRoleId) {
      throw new Error("Customer role not found in the database");
    }
    
    const hashedPassword = await bcrypt.hash("password123", 10);
    const testUser = {
      username: "testuser",
      password: hashedPassword,
      email: "test@example.com",
      fullName: "Test User",
      roleId: customerRoleId
    };
    
    const insertedUser = await db.insert(users).values(testUser).returning();
    console.log(`Added test user: ${insertedUser[0].username}`);

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seed();