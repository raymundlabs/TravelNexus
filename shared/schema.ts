import { pgTable, text, serial, integer, boolean, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRoleSchema = createInsertSchema(roles).pick({
  name: true,
  description: true,
});

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
  phone: text("phone"),
  roleId: integer("role_id").default(1), // Default to regular user
  isActive: boolean("is_active").default(true),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  lastLogin: timestamp("last_login"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  verificationToken: text("verification_token"),
  profileImage: text("profile_image"),
});

// We'll manually handle relations between users and roles through queries

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  roleId: true,
});

// Destinations
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  country: true,
  description: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
});

// Hotels
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destinationId: integer("destination_id").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
  amenities: text("amenities").array(),
  featured: boolean("featured").default(false),
});

export const insertHotelSchema = createInsertSchema(hotels).pick({
  name: true,
  destinationId: true,
  description: true,
  address: true,
  price: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
  amenities: true,
  featured: true,
});

// Tours
export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destinationId: integer("destination_id").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
  inclusions: text("inclusions").array(),
  groupSize: text("group_size"),
  featured: boolean("featured").default(false),
});

export const insertTourSchema = createInsertSchema(tours).pick({
  name: true,
  destinationId: true,
  description: true,
  duration: true,
  price: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
  inclusions: true,
  groupSize: true,
  featured: true,
});

// Packages
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  destinationId: integer("destination_id").notNull(),
  duration: text("duration").notNull(),
  price: real("price").notNull(),
  discountedPrice: real("discounted_price"),
  imageUrl: text("image_url").notNull(),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
  highlights: text("highlights").array(),
  inclusions: text("inclusions").array(),
  isBestseller: boolean("is_bestseller").default(false),
  discountPercentage: integer("discount_percentage"),
  featured: boolean("featured").default(false),
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  name: true,
  description: true,
  destinationId: true,
  duration: true,
  price: true,
  discountedPrice: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
  highlights: true,
  inclusions: true,
  isBestseller: true,
  discountPercentage: true,
  featured: true,
});

// Special Offers
export const specialOffers = pgTable("special_offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  originalPrice: real("original_price").notNull(),
  discountedPrice: real("discounted_price").notNull(),
  discountPercentage: integer("discount_percentage"),
  badge: text("badge"), // e.g., "20% OFF", "HOT DEAL"
  priceUnit: text("price_unit").default("person"), // e.g., "person", "night"
});

export const insertSpecialOfferSchema = createInsertSchema(specialOffers).pick({
  title: true,
  description: true,
  imageUrl: true,
  originalPrice: true,
  discountedPrice: true,
  discountPercentage: true,
  badge: true,
  priceUnit: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorImage: text("author_image"),
  rating: real("rating").notNull(),
  productName: text("product_name").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  content: true,
  authorName: true,
  authorImage: true,
  rating: true,
  productName: true,
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookingType: text("booking_type").notNull(), // "hotel", "tour", "package"
  itemId: integer("item_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  guests: integer("guests").notNull().default(1),
  totalPrice: real("total_price").notNull(),
  status: text("status").default("pending"), // "pending", "confirmed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  bookingType: true,
  itemId: true,
  startDate: true,
  endDate: true,
  guests: true,
  totalPrice: true,
  status: true,
});

// Export all types
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type Tour = typeof tours.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

export type SpecialOffer = typeof specialOffers.$inferSelect;
export type InsertSpecialOffer = z.infer<typeof insertSpecialOfferSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
