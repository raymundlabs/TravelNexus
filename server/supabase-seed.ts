import 'dotenv/config';
import { db } from './supabase-db';
import {
  users,
  destinations,
  hotels,
  tours,
  packages,
  specialOffers,
  testimonials,
  roles
} from '@shared/schema';
import { hash } from 'bcryptjs';

async function seedDatabase() {
  console.log('Starting database seeding process...');
  
  try {
    // Clear existing data (optional) - comment this out if you want to keep existing data
    // await clearExistingData();
    
    // Seed roles
    const roleIds = await seedRoles();
    
    // Seed users with different roles
    await seedUsers(roleIds);
    
    // Seed destinations
    const destinationIds = await seedDestinations();
    
    // Seed hotels, tours, and packages
    await seedHotels(destinationIds);
    await seedTours(destinationIds);
    await seedPackages(destinationIds);
    
    // Seed special offers and testimonials
    await seedSpecialOffers();
    await seedTestimonials();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function clearExistingData() {
  console.log('Clearing existing data...');
  
  // Delete in reverse order to avoid foreign key constraints
  await db.delete(testimonials).execute();
  await db.delete(specialOffers).execute();
  await db.delete(packages).execute();
  await db.delete(tours).execute();
  await db.delete(hotels).execute();
  await db.delete(destinations).execute();
  await db.delete(users).execute();
  await db.delete(roles).execute();
  
  console.log('Existing data cleared.');
}

async function seedRoles() {
  console.log('Seeding roles...');
  
  const roleData = [
    { name: 'user', description: 'Regular user with booking privileges' },
    { name: 'hotel', description: 'Hotel owner with property management privileges' },
    { name: 'agent', description: 'Travel agent with booking and commission privileges' },
    { name: 'superadmin', description: 'Administrator with full system access' }
  ];
  
  const insertedRoles = await db.insert(roles).values(roleData).returning();
  
  console.log(`Added ${insertedRoles.length} roles.`);
  
  // Create a map for easy reference
  const roleMap = new Map();
  insertedRoles.forEach(role => {
    roleMap.set(role.name, role.id);
  });
  
  return roleMap;
}

async function seedUsers(roleIds: Map<string, number>) {
  console.log('Seeding users...');
  
  // Hash password for test users (password: test123)
  const hashedPassword = await hash('test123', 10);
  
  const userData = [
    {
      username: 'demouser',
      password: hashedPassword,
      email: 'user@example.com',
      fullName: 'Demo User',
      roleId: roleIds.get('user'),
      phone: '+639123456789',
      isActive: true,
      isEmailVerified: true
    },
    {
      username: 'hotelowner',
      password: hashedPassword,
      email: 'hotel@example.com',
      fullName: 'Hotel Owner',
      roleId: roleIds.get('hotel'),
      phone: '+639123456788',
      isActive: true,
      isEmailVerified: true
    },
    {
      username: 'travelagent',
      password: hashedPassword,
      email: 'agent@example.com',
      fullName: 'Travel Agent',
      roleId: roleIds.get('agent'),
      phone: '+639123456787',
      isActive: true,
      isEmailVerified: true
    },
    {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      fullName: 'System Administrator',
      roleId: roleIds.get('superadmin'),
      phone: '+639123456786',
      isActive: true,
      isEmailVerified: true
    }
  ];
  
  const insertedUsers = await db.insert(users).values(userData).returning();
  
  console.log(`Added ${insertedUsers.length} users.`);
}

async function seedDestinations() {
  console.log('Seeding destinations...');
  
  const destinationData = [
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
  
  const insertedDestinations = await db.insert(destinations).values(destinationData).returning();
  
  console.log(`Added ${insertedDestinations.length} destinations.`);
  
  // Create a map for easy reference
  const destinationMap = new Map();
  insertedDestinations.forEach(dest => {
    destinationMap.set(dest.name, dest.id);
  });
  
  return destinationMap;
}

async function seedHotels(destinationIds: Map<string, number>) {
  console.log('Seeding hotels...');
  
  const hotelData = [
    {
      name: 'White Beach Resort & Spa',
      destinationId: destinationIds.get('White Beach'),
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
      destinationId: destinationIds.get('White Beach'),
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
      destinationId: destinationIds.get('White Beach'),
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
      name: 'Talipanan Beach Resort',
      destinationId: destinationIds.get('Talipanan Beach'),
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
      destinationId: destinationIds.get('Sabang Beach'),
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
  
  const insertedHotels = await db.insert(hotels).values(hotelData).returning();
  
  console.log(`Added ${insertedHotels.length} hotels.`);
}

async function seedTours(destinationIds: Map<string, number>) {
  console.log('Seeding tours...');
  
  const tourData = [
    {
      name: 'Island Hopping Adventure',
      destinationId: destinationIds.get('White Beach'),
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
      destinationId: destinationIds.get('Sabang Beach'),
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
      destinationId: destinationIds.get('White Beach'),
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
      destinationId: destinationIds.get('Talipanan Beach'),
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
      destinationId: destinationIds.get('White Beach'),
      description: 'Watch the stunning Puerto Galera sunset from a traditional outrigger boat (banca) with drinks and snacks.',
      duration: '2 hours',
      price: 900, // in PHP
      imageUrl: 'https://images.unsplash.com/photo-1605908584126-8a581aed37b3',
      rating: 4.9,
      reviewCount: 98,
      inclusions: ['Boat Ride', 'Drinks', 'Snacks', 'Professional Crew'],
      groupSize: 'Small group',
      featured: true
    }
  ];
  
  const insertedTours = await db.insert(tours).values(tourData).returning();
  
  console.log(`Added ${insertedTours.length} tours.`);
}

async function seedPackages(destinationIds: Map<string, number>) {
  console.log('Seeding packages...');
  
  const packageData = [
    {
      name: 'White Beach Weekend Getaway',
      description: '3-day escape with beachfront accommodation at White Beach Resort & Spa, island hopping tour, and sunset sailing adventure.',
      destinationId: destinationIds.get('White Beach'),
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
      destinationId: destinationIds.get('Sabang Beach'),
      duration: '5 days / 4 nights',
      price: 22500, // in PHP
      discountedPrice: 18900, // in PHP
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
      rating: 4.7,
      reviewCount: 132,
      highlights: ['Diving Experience', 'ATV Adventure', 'Waterfall Trek'],
      inclusions: ['Resort Accommodation', 'Daily Breakfast', '3 Tours', 'Equipment Rental', 'Ferry Transfers'],
      isBestseller: true,
      discountPercentage: 16,
      featured: true
    },
    {
      name: 'Talipanan Beach Relaxation Package',
      description: '4-day relaxation package with beachfront accommodation, massage treatments, and leisurely activities in the quiet Talipanan Beach area.',
      destinationId: destinationIds.get('Talipanan Beach'),
      duration: '4 days / 3 nights',
      price: 18500, // in PHP
      discountedPrice: 16650, // in PHP
      imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f',
      rating: 4.6,
      reviewCount: 87,
      highlights: ['Beachfront Resort', 'Spa Treatments', 'Beach Yoga'],
      inclusions: ['Resort Accommodation', 'Daily Breakfast', '2 Spa Treatments', 'Yoga Sessions', 'Ferry Transfers'],
      isBestseller: false,
      discountPercentage: 10,
      featured: true
    }
  ];
  
  const insertedPackages = await db.insert(packages).values(packageData).returning();
  
  console.log(`Added ${insertedPackages.length} packages.`);
}

async function seedSpecialOffers() {
  console.log('Seeding special offers...');
  
  const specialOfferData = [
    {
      title: 'Summer Sale: White Beach Resort',
      description: 'Enjoy 20% off on all room types at White Beach Resort & Spa. Limited time offer!',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      originalPrice: 7500,
      discountedPrice: 6000,
      discountPercentage: 20,
      badge: '20% OFF',
      priceUnit: 'night',
      destinationId: null,
      hotelId: null,
      tourId: null,
      packageId: null,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdBy: null
    },
    {
      title: 'Island Hopping Tour Special',
      description: 'Book our Island Hopping Adventure for 4 people and get a free sunset cruise!',
      imageUrl: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94',
      originalPrice: 6000,
      discountedPrice: 6000,
      discountPercentage: 0,
      badge: 'FREE BONUS',
      priceUnit: 'group',
      destinationId: null,
      hotelId: null,
      tourId: null,
      packageId: null,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      createdBy: null
    },
    {
      title: 'Honeymoon Package Deal',
      description: 'Special honeymoon offer with romantic dinner, couples massage, and room decoration.',
      imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f',
      originalPrice: 22000,
      discountedPrice: 19800,
      discountPercentage: 10,
      badge: 'HONEYMOON',
      priceUnit: 'package',
      destinationId: null,
      hotelId: null,
      tourId: null,
      packageId: null,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      createdBy: null
    }
  ];
  
  const insertedOffers = await db.insert(specialOffers).values(specialOfferData).returning();
  
  console.log(`Added ${insertedOffers.length} special offers.`);
}

async function seedTestimonials() {
  console.log('Seeding testimonials...');
  
  const testimonialData = [
    {
      content: "My stay at White Beach Resort was incredible! The staff was so friendly and the rooms were beautiful. The beach access was perfect and the food at the restaurant was delicious.",
      authorName: "Sarah Johnson",
      authorImage: "https://randomuser.me/api/portraits/women/12.jpg",
      rating: 5.0,
      productName: "White Beach Resort & Spa",
      hotelId: null,
      tourId: null,
      packageId: null,
      videoUrl: null,
      userId: null
    },
    {
      content: "The Island Hopping Adventure was the highlight of our trip! We saw so many beautiful spots and the guide was knowledgeable and fun. Highly recommend!",
      authorName: "David Wong",
      authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 4.8,
      productName: "Island Hopping Adventure",
      hotelId: null,
      tourId: null,
      packageId: null,
      videoUrl: null,
      userId: null
    },
    {
      content: "Puerto Galera Adventure Package was worth every peso. The diving was amazing and the waterfall trek was an experience we'll never forget. Perfect for adventure seekers!",
      authorName: "Michelle Garcia",
      authorImage: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5.0,
      productName: "Puerto Galera Adventure Package",
      hotelId: null,
      tourId: null,
      packageId: null,
      videoUrl: null,
      userId: null
    }
  ];
  
  const insertedTestimonials = await db.insert(testimonials).values(testimonialData).returning();
  
  console.log(`Added ${insertedTestimonials.length} testimonials.`);
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('Database seeding process completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error in seeding process:', error);
    process.exit(1);
  });