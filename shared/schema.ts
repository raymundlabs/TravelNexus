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
  date
} from "drizzle-orm/pg-core";
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
  roleId: integer("role_id").notNull().references(() => roles.id),
  isActive: boolean("is_active").default(true),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  lastLogin: timestamp("last_login"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  verificationToken: text("verification_token"),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
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
  destinationId: integer("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
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
  destinationId: integer("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
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
  destinationId: integer("destination_id")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
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
  badge: text("badge"),
  priceUnit: text("price_unit").default("person"),
  destinationId: integer("destination_id").references(() => destinations.id),
  hotelId: integer("hotel_id").references(() => hotels.id),
  tourId: integer("tour_id").references(() => tours.id),
  packageId: integer("package_id").references(() => packages.id),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  createdBy: integer("created_by").references(() => users.id),
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
  destinationId: true,
  hotelId: true,
  tourId: true,
  packageId: true,
  validFrom: true,
  validUntil: true,
  createdBy: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorImage: text("author_image"),
  videoUrl: text("video_url"),
  rating: real("rating").notNull(),
  productName: text("product_name").notNull(),
  userId: integer("user_id").references(() => users.id),
  hotelId: integer("hotel_id").references(() => hotels.id),
  tourId: integer("tour_id").references(() => tours.id),
  packageId: integer("package_id").references(() => packages.id),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  content: true,
  authorName: true,
  authorImage: true,
  videoUrl: true,
  rating: true,
  productName: true,
  userId: true,
  hotelId: true,
  tourId: true,
  packageId: true,
});

// Hotel Owner Profiles
export const hotelOwnerProfiles = pgTable("hotel_owner_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  businessAddress: text("business_address").notNull(),
  taxId: text("tax_id"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  verificationStatus: text("verification_status").default("pending"),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: integer("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  bankAccountInfo: jsonb("bank_account_info"),
});

export const insertHotelOwnerProfileSchema = createInsertSchema(hotelOwnerProfiles).pick({
  userId: true,
  companyName: true,
  businessAddress: true,
  taxId: true,
  contactPerson: true,
  contactPhone: true,
  bankAccountInfo: true,
});

// Agent Profiles
export const agentProfiles = pgTable("agent_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  agencyName: text("agency_name").notNull(),
  agencyAddress: text("agency_address").notNull(),
  licenseNumber: text("license_number"),
  commissionRate: real("commission_rate").default(0),
  specialization: text("specialization").array(),
  verificationStatus: text("verification_status").default("pending"),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: integer("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  bankAccountInfo: jsonb("bank_account_info"),
});

export const insertAgentProfileSchema = createInsertSchema(agentProfiles).pick({
  userId: true,
  agencyName: true,
  agencyAddress: true,
  licenseNumber: true,
  commissionRate: true,
  specialization: true,
  bankAccountInfo: true,
});

// Hotel Ownership
export const hotelOwnership = pgTable("hotel_ownership", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => hotelOwnerProfiles.id, { onDelete: "cascade" }),
  ownershipType: text("ownership_type").default("primary"),
  ownershipPercentage: real("ownership_percentage").default(100.0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.hotelId, table.ownerId),
  };
});

export const insertHotelOwnershipSchema = createInsertSchema(hotelOwnership).pick({
  hotelId: true,
  ownerId: true,
  ownershipType: true,
  ownershipPercentage: true,
});

// Permissions
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  resource: text("resource").notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPermissionSchema = createInsertSchema(permissions).pick({
  name: true,
  description: true,
  resource: true,
  action: true,
});

// Role Permissions
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.roleId, table.permissionId),
  };
});

export const insertRolePermissionSchema = createInsertSchema(rolePermissions).pick({
  roleId: true,
  permissionId: true,
});

// Payment Methods
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  processingFeePercentage: real("processing_fee_percentage").default(0),
  paymentType: text("payment_type").notNull(),
  requiresVerification: boolean("requires_verification").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).pick({
  name: true,
  description: true,
  isActive: true,
  processingFeePercentage: true,
  paymentType: true,
  requiresVerification: true,
});

// User Payment Methods
export const userPaymentMethods = pgTable("user_payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  paymentMethodId: integer("payment_method_id")
    .notNull()
    .references(() => paymentMethods.id, { onDelete: "cascade" }),
  isDefault: boolean("is_default").default(false),
  details: jsonb("details"),
  verificationStatus: text("verification_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.paymentMethodId),
  };
});

export const insertUserPaymentMethodSchema = createInsertSchema(userPaymentMethods).pick({
  userId: true,
  paymentMethodId: true,
  isDefault: true,
  details: true,
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingReference: text("booking_reference").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  bookingType: text("booking_type").notNull(),
  itemId: integer("item_id").notNull(),
  agentId: integer("agent_id").references(() => agentProfiles.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  guests: integer("guests").notNull().default(1),
  subtotalPrice: real("subtotal_price").notNull(),
  discountAmount: real("discount_amount").default(0),
  taxAmount: real("tax_amount").default(0),
  totalPrice: real("total_price").notNull(),
  status: text("status").default("pending"),
  cancellationReason: text("cancellation_reason"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  bookingReference: true,
  userId: true,
  bookingType: true,
  itemId: true,
  agentId: true,
  startDate: true,
  endDate: true,
  guests: true,
  subtotalPrice: true,
  discountAmount: true,
  taxAmount: true,
  totalPrice: true,
  status: true,
  specialRequests: true,
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  paymentMethodId: integer("payment_method_id")
    .notNull()
    .references(() => paymentMethods.id),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(),
  transactionId: text("transaction_id"),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentDetails: jsonb("payment_details"),
  refundAmount: real("refund_amount").default(0),
  refundDate: timestamp("refund_date"),
  refundReason: text("refund_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  bookingId: true,
  paymentMethodId: true,
  amount: true,
  currency: true,
  status: true,
  transactionId: true,
  paymentDate: true,
  paymentDetails: true,
});

// Reward Point Rules
export const rewardPointRules = pgTable("reward_point_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  bookingType: text("booking_type"),
  pointsPerBooking: integer("points_per_booking").default(0),
  pointsPerAmount: real("points_per_amount").default(0),
  minimumBookingAmount: real("minimum_booking_amount").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRewardPointRuleSchema = createInsertSchema(rewardPointRules).pick({
  name: true,
  description: true,
  bookingType: true,
  pointsPerBooking: true,
  pointsPerAmount: true,
  minimumBookingAmount: true,
  isActive: true,
});

// Agent Reward Points
export const agentRewardPoints = pgTable("agent_reward_points", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  pointsBalance: integer("points_balance").notNull().default(0),
  lifetimePoints: integer("lifetime_points").notNull().default(0),
  tier: text("tier").default("bronze"),
  lastActivityDate: timestamp("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAgentRewardPointsSchema = createInsertSchema(agentRewardPoints).pick({
  agentId: true,
  pointsBalance: true,
  lifetimePoints: true,
  tier: true,
});

// Agent Point Transactions
export const agentPointTransactions = pgTable("agent_point_transactions", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  bookingId: integer("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  transactionType: text("transaction_type").notNull(),
  points: integer("points").notNull(),
  description: text("description"),
  ruleId: integer("rule_id").references(() => rewardPointRules.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgentPointTransactionSchema = createInsertSchema(agentPointTransactions).pick({
  agentId: true,
  bookingId: true,
  transactionType: true,
  points: true,
  description: true,
  ruleId: true,
});

// Reward Redemption Options
export const rewardRedemptionOptions = pgTable("reward_redemption_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pointsRequired: integer("points_required").notNull(),
  redemptionType: text("redemption_type").notNull(),
  valueAmount: real("value_amount"),
  isActive: boolean("is_active").default(true),
  availabilityStart: timestamp("availability_start"),
  availabilityEnd: timestamp("availability_end"),
  termsAndConditions: text("terms_and_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRewardRedemptionOptionSchema = createInsertSchema(rewardRedemptionOptions).pick({
  name: true,
  description: true,
  pointsRequired: true,
  redemptionType: true,
  valueAmount: true,
  isActive: true,
  availabilityStart: true,
  availabilityEnd: true,
  termsAndConditions: true,
});

// Agent Reward Redemptions
export const agentRewardRedemptions = pgTable("agent_reward_redemptions", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  optionId: integer("option_id")
    .notNull()
    .references(() => rewardRedemptionOptions.id, { onDelete: "cascade" }),
  pointsUsed: integer("points_used").notNull(),
  redemptionStatus: text("redemption_status").notNull().default("pending"),
  redemptionDate: timestamp("redemption_date").defaultNow(),
  deliveryDetails: jsonb("delivery_details"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAgentRewardRedemptionSchema = createInsertSchema(agentRewardRedemptions).pick({
  agentId: true,
  optionId: true,
  pointsUsed: true,
  redemptionStatus: true,
  redemptionDate: true,
  deliveryDetails: true,
  notes: true,
});

// Notification Templates
export const notificationTemplates = pgTable("notification_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  titleTemplate: text("title_template").notNull(),
  bodyTemplate: text("body_template").notNull(),
  notificationType: text("notification_type").notNull(),
  deepLink: text("deep_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).pick({
  name: true,
  description: true,
  titleTemplate: true,
  bodyTemplate: true,
  notificationType: true,
  deepLink: true,
});

// User Devices
export const userDevices = pgTable("user_devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  deviceToken: text("device_token").notNull(),
  deviceType: text("device_type").notNull(),
  deviceName: text("device_name"),
  osVersion: text("os_version"),
  appVersion: text("app_version"),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.deviceToken),
  };
});

export const insertUserDeviceSchema = createInsertSchema(userDevices).pick({
  userId: true,
  deviceToken: true,
  deviceType: true,
  deviceName: true,
  osVersion: true,
  appVersion: true,
  isActive: true,
});

// Push Notifications
export const pushNotifications = pgTable("push_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  deviceId: integer("device_id").references(() => userDevices.id, { onDelete: "set null" }),
  templateId: integer("template_id").references(() => notificationTemplates.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  data: jsonb("data"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  status: text("status").default("pending"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPushNotificationSchema = createInsertSchema(pushNotifications).pick({
  userId: true,
  deviceId: true,
  templateId: true,
  title: true,
  body: true,
  data: true,
  status: true,
});

// Notification Settings
export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookingNotifications: boolean("booking_notifications").default(true),
  paymentNotifications: boolean("payment_notifications").default(true),
  promotionNotifications: boolean("promotion_notifications").default(true),
  accountNotifications: boolean("account_notifications").default(true),
  rewardNotifications: boolean("reward_notifications").default(true),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.userId),
  };
});

export const insertNotificationSettingSchema = createInsertSchema(notificationSettings).pick({
  userId: true,
  bookingNotifications: true,
  paymentNotifications: true,
  promotionNotifications: true,
  accountNotifications: true,
  rewardNotifications: true,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: true,
});

// User Activity Logs
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: integer("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).pick({
  userId: true,
  action: true,
  resourceType: true,
  resourceId: true,
  details: true,
  ipAddress: true,
  userAgent: true,
});

// Hotel Owner Stats
export const hotelOwnerStats = pgTable("hotel_owner_stats", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => hotelOwnerProfiles.id, { onDelete: "cascade" }),
  hotelId: integer("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  totalBookings: integer("total_bookings").default(0),
  occupancyRate: real("occupancy_rate").default(0),
  revenue: real("revenue").default(0),
  cancelledBookings: integer("cancelled_bookings").default(0),
  averageRating: real("average_rating").default(0),
  newReviews: integer("new_reviews").default(0),
}, (table) => {
  return {
    unq: unique().on(table.ownerId, table.hotelId, table.date),
  };
});

export const insertHotelOwnerStatSchema = createInsertSchema(hotelOwnerStats).pick({
  ownerId: true,
  hotelId: true,
  date: true,
  totalBookings: true,
  occupancyRate: true,
  revenue: true,
  cancelledBookings: true,
  averageRating: true,
  newReviews: true,
});

// Agent Stats
export const agentStats = pgTable("agent_stats", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agentProfiles.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  totalBookings: integer("total_bookings").default(0),
  totalSales: real("total_sales").default(0),
  commissionEarned: real("commission_earned").default(0),
  pointsEarned: integer("points_earned").default(0),
  bookingTypes: jsonb("booking_types"),
}, (table) => {
  return {
    unq: unique().on(table.agentId, table.date),
  };
});

export const insertAgentStatSchema = createInsertSchema(agentStats).pick({
  agentId: true,
  date: true,
  totalBookings: true,
  totalSales: true,
  commissionEarned: true,
  pointsEarned: true,
  bookingTypes: true,
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

export type HotelOwnerProfile = typeof hotelOwnerProfiles.$inferSelect;
export type InsertHotelOwnerProfile = z.infer<typeof insertHotelOwnerProfileSchema>;

export type AgentProfile = typeof agentProfiles.$inferSelect;
export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;

export type HotelOwnership = typeof hotelOwnership.$inferSelect;
export type InsertHotelOwnership = z.infer<typeof insertHotelOwnershipSchema>;

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;

export type UserPaymentMethod = typeof userPaymentMethods.$inferSelect;
export type InsertUserPaymentMethod = z.infer<typeof insertUserPaymentMethodSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type RewardPointRule = typeof rewardPointRules.$inferSelect;
export type InsertRewardPointRule = z.infer<typeof insertRewardPointRuleSchema>;

export type AgentRewardPoint = typeof agentRewardPoints.$inferSelect;
export type InsertAgentRewardPoint = z.infer<typeof insertAgentRewardPointsSchema>;

export type AgentPointTransaction = typeof agentPointTransactions.$inferSelect;
export type InsertAgentPointTransaction = z.infer<typeof insertAgentPointTransactionSchema>;

export type RewardRedemptionOption = typeof rewardRedemptionOptions.$inferSelect;
export type InsertRewardRedemptionOption = z.infer<typeof insertRewardRedemptionOptionSchema>;

export type AgentRewardRedemption = typeof agentRewardRedemptions.$inferSelect;
export type InsertAgentRewardRedemption = z.infer<typeof insertAgentRewardRedemptionSchema>;

export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;

export type UserDevice = typeof userDevices.$inferSelect;
export type InsertUserDevice = z.infer<typeof insertUserDeviceSchema>;

export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = z.infer<typeof insertPushNotificationSchema>;

export type NotificationSetting = typeof notificationSettings.$inferSelect;
export type InsertNotificationSetting = z.infer<typeof insertNotificationSettingSchema>;

export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;

export type HotelOwnerStat = typeof hotelOwnerStats.$inferSelect;
export type InsertHotelOwnerStat = z.infer<typeof insertHotelOwnerStatSchema>;

export type AgentStat = typeof agentStats.$inferSelect;
export type InsertAgentStat = z.infer<typeof insertAgentStatSchema>;



