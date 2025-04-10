import { db } from "./db";
import {
  users,
  destinations,
  hotels,
  tours,
  packages,
  specialOffers,
  testimonials,
} from "@shared/schema";
import { sql } from "drizzle-orm";

async function checkDataExists() {
  try {
    // Use raw SQL to count destinations
    const result = await db.execute(sql`SELECT COUNT(*) FROM destinations`);
    const count = parseInt(result.rows[0].count as string);
    return count > 0;
  } catch (error) {
    console.error("Error checking if data exists:", error);
    return false;
  }
}

async function clearData() {
  try {
    // Clear all existing data
    await db.delete(users);
    await db.delete(destinations);
    await db.delete(hotels);
    await db.delete(tours);
    await db.delete(packages);
    await db.delete(specialOffers);
    await db.delete(testimonials);
    console.log("Cleared existing data");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Check if we already have data
    const hasData = await checkDataExists();
    if (hasData) {
      console.log("Database already has data. Skipping seeding operation.");
      return;
    }
      
    // Clear any existing data
    await clearData();
    
    // Sample destinations
    const sampleDestinations = [
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
    
    const insertedDestinations = await db.insert(destinations).values(sampleDestinations).returning();
    console.log(`Added ${insertedDestinations.length} destinations`);

    // Sample hotels
    const sampleHotels = [
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
    
    const insertedHotels = await db.insert(hotels).values(sampleHotels).returning();
    console.log(`Added ${insertedHotels.length} hotels`);

    // Sample tours
    const sampleTours = [
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
    
    const insertedTours = await db.insert(tours).values(sampleTours).returning();
    console.log(`Added ${insertedTours.length} tours`);

    // Sample packages
    const samplePackages = [
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
    
    const insertedPackages = await db.insert(packages).values(samplePackages).returning();
    console.log(`Added ${insertedPackages.length} packages`);

    // Sample special offers
    const sampleSpecialOffers = [
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
    
    const insertedSpecialOffers = await db.insert(specialOffers).values(sampleSpecialOffers).returning();
    console.log(`Added ${insertedSpecialOffers.length} special offers`);

    // Sample testimonials
    const sampleTestimonials = [
      {
        content: "The Bali package was absolutely amazing! Everything was well-organized, from the airport pickup to the tours. The hotel was beautiful and the staff was incredibly friendly. Would book again in a heartbeat!",
        authorName: "Sarah Johnson",
        authorImage: "https://randomuser.me/api/portraits/women/12.jpg",
        rating: 5.0,
        productName: "Tropical Paradise Escape"
      },
      {
        content: "Our European City Explorer tour was a dream come true. The hotels were charming, the guides were knowledgeable, and the itinerary was perfect. Just the right balance of structured activities and free time.",
        authorName: "Michael Chen",
        authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
        rating: 4.5,
        productName: "European City Explorer"
      },
      {
        content: "The sunset sailing tour was the highlight of our trip! The crew was fun and professional, and the views were breathtaking. The complimentary drinks and snacks were a nice touch. Highly recommend!",
        authorName: "Emily Rodriguez",
        authorImage: "https://randomuser.me/api/portraits/women/42.jpg",
        rating: 5.0,
        productName: "Sunset Sailing Adventure"
      }
    ];
    
    const insertedTestimonials = await db.insert(testimonials).values(sampleTestimonials).returning();
    console.log(`Added ${insertedTestimonials.length} testimonials`);

    // Add a test user
    const testUser = {
      username: "testuser",
      password: "password123",
      email: "test@example.com",
      fullName: "Test User"
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