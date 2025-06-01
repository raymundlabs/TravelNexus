import { users } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';
import { storage } from "./storage";
import { supabase } from "./supabase";
import { InsertAgentProfile, InsertPackage, InsertDestination, InsertSpecialOffer, InsertTestimonial, InsertHotel, InsertTour, InsertRole, InsertBooking, InsertPayment, InsertHotelOwnerProfile, InsertHotelOwnership, InsertAgentRewardPoint, InsertAgentPointTransaction, InsertAgentRewardRedemption } from "@shared/schema";

// Add debug logging
console.log("Starting seed script based on provided schema...");

async function checkDataExists() {
  try {
    const destinations = await fetchData('destinations');
    return destinations.length > 0;
  } catch (error) {
    console.error("Error checking if data exists:", error);
    return false;
  }
}

async function clearData() {
  console.log("Clearing existing data...");
  // Clear data from tables, respecting foreign key constraints

  // This should be done in reverse order of dependencies
  // We no longer delete users directly as Supabase Auth manages them
  // await db.delete(users);
  // await db.delete(testimonials);
  // await db.delete(specialOffers);
  // await db.delete(packages);
  // await db.delete(tours);
  // await db.delete(hotels);
  // await db.delete(destinations);
  // await db.delete(roles);

  // For MemStorage, just re-initialize maps (or manually clear them)
  // For now, we will rely on the in-memory storage to be cleared on server restart
  console.log("Existing data cleared (for MemStorage, this is typically done on server restart).");
}

async function seed() {
  console.log("Seeding database with sample data...");

  // Clear existing data (if using MemStorage, this is a conceptual clear)
  await clearData();

  // Sample Roles
  const sampleRoles: InsertRole[] = [
    { id: uuidv4(), name: 'super_admin', description: 'Can manage all aspects of the application' },
    { id: uuidv4(), name: 'admin', description: 'Can manage most content and users' },
    { id: uuidv4(), name: 'agent', description: 'Can manage bookings and view user data' },
    { id: uuidv4(), name: 'hotel_owner', description: 'Can manage their hotel properties' },
    { id: uuidv4(), name: 'user', description: 'Regular user with booking capabilities' },
  ];

  for (const roleData of sampleRoles) {
    await storage.createRole(roleData);
  }

  // Super Admin User (created via Supabase Auth)
  const superAdminRole = sampleRoles.find(role => role.name === 'super_admin');
  if (superAdminRole) {
    const { data, error } = await supabase.auth.signUp({
      email: "superadmin@example.com",
      password: "123456", // Supabase hashes this automatically
      options: {
        data: {
          username: "superadmin",
          full_name: "Super Admin",
          role_id: superAdminRole.id, // Custom data in Supabase user metadata
          is_active: true,
          is_email_verified: true,
        },
      },
    });

    if (error) {
      console.error("Error creating superadmin:", error.message);
    } else {
      console.log("Superadmin user created successfully:", data.user?.id);
    }
  }

  // Sample Users (other users for roles like agent, hotel_owner, regular user)
  // These users will also be created through Supabase Auth, but their custom data
  // like roleId will be part of the user_metadata.
  const sampleUsers = [
    {
      username: "agent_user",
      email: "agent@example.com",
      password: "password123",
      fullName: "Agent User",
      roleId: sampleRoles.find(role => role.name === 'agent')?.id,
      isActive: true,
      isEmailVerified: true,
    },
    {
      username: "hotel_owner_user",
      email: "hotelowner@example.com",
      password: "password123",
      fullName: "Hotel Owner User",
      roleId: sampleRoles.find(role => role.name === 'hotel_owner')?.id,
      isActive: true,
      isEmailVerified: true,
    },
    {
      username: "test_user",
      email: "user@example.com",
      password: "password123",
      fullName: "Test User",
      roleId: sampleRoles.find(role => role.name === 'user')?.id,
      isActive: true,
      isEmailVerified: true,
    },
  ];

  for (const userData of sampleUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          full_name: userData.fullName,
          role_id: userData.roleId,
          is_active: userData.isActive,
          is_email_verified: userData.isEmailVerified,
        },
      },
    });

    if (error) {
      console.error(`Error creating user ${userData.email}:`, error.message);
    } else {
      console.log(`User ${userData.email} created successfully:`, data.user?.id);
    }
  }

  // Sample Destinations
  const sampleDestinations: InsertDestination[] = [
    { id: uuidv4(), name: 'Paris', description: 'The city of love', rating: 4.8, country: 'France', image_url: 'https://example.com/paris.jpg', review_count: 1200, created_at: new Date(), updated_at: new Date(), featured: true },
    { id: uuidv4(), name: 'Tokyo', description: 'Vibrant metropolis', rating: 4.9, country: 'Japan', image_url: 'https://example.com/tokyo.jpg', review_count: 1500, created_at: new Date(), updated_at: new Date(), featured: true },
  ];

  for (const destinationData of sampleDestinations) {
    await storage.createDestination(destinationData);
  }

  // Sample Hotels
  const paris = await storage.getDestinations().then(dests => dests.find(d => d.name === 'Paris'));
  const tokyo = await storage.getDestinations().then(dests => dests.find(d => d.name === 'Tokyo'));

  const sampleHotels: InsertHotel[] = [
    { id: uuidv4(), name: 'Hotel Louvre', description: 'Luxury hotel near the Louvre', rating: 4.7, image_url: 'https://example.com/louvre_hotel.jpg', review_count: 500, price_per_night: 300, amenities: ['WiFi', 'Pool', 'Gym'], destination_id: paris?.id || '', created_at: new Date(), updated_at: new Date(), featured: true },
    { id: uuidv4(), name: 'Tokyo Inn', description: 'Cozy hotel in Shinjuku', rating: 4.5, image_url: 'https://example.com/tokyo_inn.jpg', review_count: 700, price_per_night: 150, amenities: ['WiFi'], destination_id: tokyo?.id || '', created_at: new Date(), updated_at: new Date(), featured: false },
  ];

  for (const hotelData of sampleHotels) {
    if (hotelData.destination_id) {
      await storage.createHotel(hotelData);
    }
  }

  // Sample Tours
  const sampleTours: InsertTour[] = [
    { id: uuidv4(), name: 'Eiffel Tower Tour', description: 'Guided tour of the Eiffel Tower', rating: 4.8, image_url: 'https://example.com/eiffel_tour.jpg', review_count: 1000, price: 50, duration: 2, destination_id: paris?.id || '', includes: ['Guide', 'Tickets'], created_at: new Date(), updated_at: new Date(), featured: true },
    { id: uuidv4(), name: 'Mount Fuji Climb', description: 'Challenging climb to Mount Fuji', rating: 4.6, image_url: 'https://example.com/fuji_tour.jpg', review_count: 800, price: 200, duration: 10, destination_id: tokyo?.id || '', includes: ['Guide', 'Gear'], created_at: new Date(), updated_at: new Date(), featured: false },
  ];

  for (const tourData of sampleTours) {
    if (tourData.destination_id) {
      await storage.createTour(tourData);
    }
  }

  // Sample Packages
  const samplePackages: InsertPackage[] = [
    { id: uuidv4(), name: 'Paris Romantic Getaway', description: '5-day romantic trip to Paris', rating: 4.9, image_url: 'https://example.com/paris_package.jpg', review_count: 600, price: 1500, duration: 5, destination_id: paris?.id || '', inclusions: ['Flights', 'Hotel', 'Tours'], created_at: new Date(), updated_at: new Date(), featured: true },
    { id: uuidv4(), name: 'Tokyo Adventure', description: '7-day adventure in Tokyo', rating: 4.7, image_url: 'https://example.com/tokyo_package.jpg', review_count: 900, price: 2500, duration: 7, destination_id: tokyo?.id || '', inclusions: ['Flights', 'Hotel', 'Tours'], created_at: new Date(), updated_at: new Date(), featured: false },
  ];

  for (const packageData of samplePackages) {
    if (packageData.destination_id) {
      await storage.createPackage(packageData);
    }
  }

  // Sample Special Offers
  const sampleSpecialOffers: InsertSpecialOffer[] = [
    { id: uuidv4(), title: 'Early Bird Discount', description: '10% off on all bookings made 3 months in advance', discount_percentage: 10, start_date: new Date(), end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)), created_at: new Date(), updated_at: new Date() },
    { id: uuidv4(), title: 'Summer Sale', description: 'Up to 20% off on selected packages', discount_percentage: 20, start_date: new Date(), end_date: new Date(new Date().setMonth(new Date().getMonth() + 2)), created_at: new Date(), updated_at: new Date() },
  ];

  for (const offerData of sampleSpecialOffers) {
    await storage.createSpecialOffer(offerData);
  }

  // Sample Testimonials
  // Assuming a user exists, for example, the superadmin or one of the sample users created above
  const { data: { users: supabaseUsers }, error: listUsersError } = await supabase.auth.admin.listUsers();

  if (listUsersError) {
    console.error("Error listing users from Supabase:", listUsersError.message);
    return; // Exit if we can't get users
  }

  const firstUser = supabaseUsers[0]; 

  if (firstUser) {
    const sampleTestimonials: InsertTestimonial[] = [
      { id: uuidv4(), user_id: firstUser.id, rating: 5, comment: 'Amazing experience, highly recommended!', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), user_id: firstUser.id, rating: 4, comment: 'Great service and well-organized tours.', created_at: new Date(), updated_at: new Date() },
    ];

    for (const testimonialData of sampleTestimonials) {
      await storage.createTestimonial(testimonialData);
    }
  }

  console.log("Database seeded successfully!");
}

// Run the seed function
seed()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed!");
    console.error(err);
    process.exit(1);
  });