import { pgTable, text, serial, integer, boolean, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").notNull().default({}),
});

export const insertUserRoleSchema = createInsertSchema(userRoles).pick({
  name: true,
  description: true,
  permissions: true,
});

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  phone: text("phone"),
  roleId: integer("role_id").default(1), // Default to customer role
  isActive: boolean("is_active").default(true),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  lastLogin: timestamp("last_login"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  verificationToken: text("verification_token"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
  roleId: true,
  profileImage: true,
});

// Hotel Providers
export const hotelProviders = pgTable("hotel_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  companyName: text("company_name").notNull(),
  companyAddress: text("company_address"),
  companyPhone: text("company_phone"),
  contactPerson: text("contact_person"),
  companyEmail: text("company_email"),
  website: text("website"),
  logo: text("logo"),
  isVerified: boolean("is_verified").default(false),
  commission: real("commission").default(10), // Default 10% commission rate
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHotelProviderSchema = createInsertSchema(hotelProviders).pick({
  userId: true,
  companyName: true,
  companyAddress: true,
  companyPhone: true,
  contactPerson: true,
  companyEmail: true,
  website: true,
  logo: true,
  commission: true,
});

// Travel Agents
export const travelAgents = pgTable("travel_agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  agencyName: text("agency_name").notNull(),
  agencyAddress: text("agency_address"),
  agencyPhone: text("agency_phone"),
  contactPerson: text("contact_person"),
  agencyEmail: text("agency_email"),
  website: text("website"),
  logo: text("logo"),
  isVerified: boolean("is_verified").default(false),
  commission: real("commission").default(8), // Default 8% commission rate
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTravelAgentSchema = createInsertSchema(travelAgents).pick({
  userId: true,
  agencyName: true,
  agencyAddress: true,
  agencyPhone: true,
  contactPerson: true,
  agencyEmail: true,
  website: true,
  logo: true,
  commission: true,
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

// Payment Methods
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").default(true),
  description: text("description"),
  icon: text("icon"),
  instructions: text("instructions"),
  additionalFees: real("additional_fees").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).pick({
  name: true,
  isActive: true,
  description: true,
  icon: true,
  instructions: true,
  additionalFees: true,
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  paymentMethodId: integer("payment_method_id").notNull(),
  paymentStatus: text("payment_status").default("pending"), // "pending", "completed", "failed", "refunded"
  transactionId: text("transaction_id"),
  receiptUrl: text("receipt_url"),
  paymentDetails: jsonb("payment_details").default({}),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  bookingId: true,
  userId: true,
  amount: true,
  paymentMethodId: true,
  paymentStatus: true,
  transactionId: true,
  receiptUrl: true,
  paymentDetails: true,
});

// Bank Transfers
export const bankTransfers = pgTable("bank_transfers", {
  id: serial("id").primaryKey(),
  paymentId: integer("payment_id").notNull().unique(),
  bankName: text("bank_name").notNull(),
  accountName: text("account_name").notNull(),
  accountNumber: text("account_number").notNull(),
  referenceNumber: text("reference_number"),
  transferDate: timestamp("transfer_date"),
  proofOfPaymentUrl: text("proof_of_payment_url"),
  notes: text("notes"),
  verifiedBy: integer("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBankTransferSchema = createInsertSchema(bankTransfers).pick({
  paymentId: true,
  bankName: true,
  accountName: true,
  accountNumber: true,
  referenceNumber: true,
  transferDate: true,
  proofOfPaymentUrl: true,
  notes: true,
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
  agentId: integer("agent_id"), // If booked through an agent
  hotelProviderId: integer("hotel_provider_id"), // If it's a hotel booking
  notes: text("notes"),
  specialRequests: text("special_requests"),
  bookingReference: text("booking_reference"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  confirmedAt: timestamp("confirmed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancelledBy: integer("cancelled_by"),
  cancellationReason: text("cancellation_reason"),
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
  agentId: true,
  hotelProviderId: true,
  notes: true,
  specialRequests: true,
});

// Export all types
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type HotelProvider = typeof hotelProviders.$inferSelect;
export type InsertHotelProvider = z.infer<typeof insertHotelProviderSchema>;

export type TravelAgent = typeof travelAgents.$inferSelect;
export type InsertTravelAgent = z.infer<typeof insertTravelAgentSchema>;

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

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type BankTransfer = typeof bankTransfers.$inferSelect;
export type InsertBankTransfer = z.infer<typeof insertBankTransferSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
