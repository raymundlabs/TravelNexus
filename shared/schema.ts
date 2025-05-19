import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  real,
  timestamp,
  jsonb,
  primaryKey,
  unique,
  foreignKey,
  date,
  varchar,
  doublePrecision
} from "drizzle-orm/pg-core";

import { InferSelectModel, InferInsertModel } from "drizzle-orm"; // Import type inference utilities
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod'; // Import createInsertSchema

// Roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export type Role = InferSelectModel<typeof roles>; // Export inferred type
export type InsertRole = InferInsertModel<typeof roles>; // Export inferred insert type

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).unique(),
  fullName: varchar("full_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  phone: text("phone"),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  isActive: boolean("is_active").default(true),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  lastLogin: timestamp("last_login"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  verificationToken: text("verification_token"),
  profileImage: text("profile_image"),
});

export type User = InferSelectModel<typeof users>; // Export inferred type
export type InsertUser = InferInsertModel<typeof users>; // Export inferred insert type

// Create insert schema for users
export const insertUserSchema = createInsertSchema(users);

// Users Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  testimonials: many(testimonials),
  bookings: many(bookings),
  agentProfile: one(agentProfiles),
  hotelOwnerProfile: one(hotelOwnerProfiles),
}));

// Destinations
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  country: varchar("country", { length: 255 }),
  description: text("description"),
  imageUrl: text("image_url"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Destination = InferSelectModel<typeof destinations>; // Export inferred type
export type InsertDestination = InferInsertModel<typeof destinations>; // Export inferred insert type

// Destinations Relations
export const destinationsRelations = relations(destinations, ({ many }) => ({
  hotels: many(hotels),
  tours: many(tours),
  packages: many(packages),
}));

// Hotels
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  destinationId: integer("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  description: text("description"),
  address: text("address"),
  price: doublePrecision("price"),
  imageUrl: text("image_url"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  amenities: text("amenities").array(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Hotel = InferSelectModel<typeof hotels>; // Export inferred type
export type InsertHotel = InferInsertModel<typeof hotels>; // Export inferred insert type

// Hotels Relations
export const hotelsRelations = relations(hotels, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [hotels.destinationId],
    references: [destinations.id],
  }),
  ownership: many(hotelOwnership),
}));

// Tours
export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  destinationId: integer("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  description: text("description"),
  duration: integer("duration"),
  price: doublePrecision("price"),
  imageUrl: text("image_url"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tour = InferSelectModel<typeof tours>; // Export inferred type
export type InsertTour = InferInsertModel<typeof tours>; // Export inferred insert type

// Tours Relations
export const toursRelations = relations(tours, ({ one }) => ({
  destination: one(destinations, {
    fields: [tours.destinationId],
    references: [destinations.id],
  }),
}));

// Packages
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  destinationId: integer("destination_id").references(() => destinations.id).notNull(),
  duration: integer("duration"),
  price: doublePrecision("price"),
  imageUrl: text("image_url"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Package = InferSelectModel<typeof packages>; // Export inferred type
export type InsertPackage = InferInsertModel<typeof packages>; // Export inferred insert type

// Packages Relations
export const packagesRelations = relations(packages, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [packages.destinationId],
    references: [destinations.id],
  }),
  bookings: many(bookings),
}));

// Special Offers
export const specialOffers = pgTable("special_offers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  discountPercentage: doublePrecision("discount_percentage"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SpecialOffer = InferSelectModel<typeof specialOffers>; // Export inferred type
export type InsertSpecialOffer = InferInsertModel<typeof specialOffers>; // Export inferred insert type

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  rating: doublePrecision("rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  videoUrl: text("video_url"),
});

export type Testimonial = InferSelectModel<typeof testimonials>; // Export inferred type
export type InsertTestimonial = InferInsertModel<typeof testimonials>; // Export inferred insert type

// Testimonials Relations
export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
}));

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  packageId: integer("package_id").references(() => packages.id, { onDelete: "set null" }),
  tourId: integer("tour_id").references(() => tours.id, { onDelete: "set null" }),
  hotelId: integer("hotel_id").references(() => hotels.id, { onDelete: "set null" }),
  bookingDate: timestamp("booking_date").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  totalAmount: real("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Booking = InferSelectModel<typeof bookings>; // Export inferred type
export type InsertBooking = InferInsertModel<typeof bookings>; // Export inferred insert type

// Bookings Relations
export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
  payment: one(payments),
}));

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  transactionId: text("transaction_id"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Payment = InferSelectModel<typeof payments>; // Export inferred type
export type InsertPayment = InferInsertModel<typeof payments>; // Export inferred insert type

// Agent Profiles
export const agentProfiles = pgTable("agent_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name"),
  businessAddress: text("business_address"),
  phone: text("phone"),
  website: text("website"),
  commissionRate: real("commission_rate").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AgentProfile = InferSelectModel<typeof agentProfiles>; // Export inferred type
export type InsertAgentProfile = InferInsertModel<typeof agentProfiles>; // Export inferred insert type

// Agent Profiles Relations
export const agentProfilesRelations = relations(agentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [agentProfiles.userId],
    references: [users.id],
  }),
}));

// Hotel Owner Profiles
export const hotelOwnerProfiles = pgTable("hotel_owner_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name"),
  businessAddress: text("business_address"),
  phone: text("phone"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type HotelOwnerProfile = InferSelectModel<typeof hotelOwnerProfiles>; // Export inferred type
export type InsertHotelOwnerProfile = InferInsertModel<typeof hotelOwnerProfiles>; // Export inferred insert type

// Hotel Owner Profiles Relations
export const hotelOwnerProfilesRelations = relations(hotelOwnerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [hotelOwnerProfiles.userId],
    references: [users.id],
  }),
}));

// Hotel Ownership
export const hotelOwnership = pgTable("hotel_ownership", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => hotelOwnerProfiles.id, { onDelete: "cascade" }),
  ownershipPercentage: real("ownership_percentage").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  assignedDate: timestamp("assigned_date").defaultNow().notNull(),
});

export type HotelOwnership = InferSelectModel<typeof hotelOwnership>; // Export inferred type
export type InsertHotelOwnership = InferInsertModel<typeof hotelOwnership>; // Export inferred insert type

// Agent Reward Points
export const agentRewardPoints = pgTable("agent_reward_points", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  totalPoints: integer("total_points").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AgentRewardPoint = InferSelectModel<typeof agentRewardPoints>; // Export inferred type
export type InsertAgentRewardPoint = InferInsertModel<typeof agentRewardPoints>; // Export inferred insert type

// Agent Point Transactions
export const agentPointTransactions = pgTable("agent_point_transactions", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  pointsEarned: integer("points_earned").default(0),
  pointsSpent: integer("points_spent").default(0),
  transactionType: text("transaction_type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AgentPointTransaction = InferSelectModel<typeof agentPointTransactions>; // Export inferred type
export type InsertAgentPointTransaction = InferInsertModel<typeof agentPointTransactions>; // Export inferred insert type

// Agent Reward Redemptions
export const agentRewardRedemptions = pgTable("agent_reward_redemptions", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  reward: text("reward").notNull(),
  pointsRedeemed: integer("points_redeemed").notNull(),
  redemptionDate: timestamp("redemption_date").defaultNow().notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AgentRewardRedemption = InferSelectModel<typeof agentRewardRedemptions>; // Export inferred type
export type InsertAgentRewardRedemption = InferInsertModel<typeof agentRewardRedemptions>; // Export inferred insert type



