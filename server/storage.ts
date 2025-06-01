import { InsertAgentProfile, InsertPackage, InsertDestination, InsertSpecialOffer, InsertTestimonial, InsertHotel, InsertTour, InsertRole, AgentProfile, Package, Destination, SpecialOffer, Testimonial, Hotel, Tour, Role, InsertComment, Comment, InsertReply, Reply, InsertBooking, Booking, InsertPayment, Payment, InsertHotelOwnerProfile, HotelOwnerProfile, InsertHotelOwnership, HotelOwnership, InsertAgentRewardPoint, AgentRewardPoint, InsertAgentPointTransaction, AgentPointTransaction, InsertAgentRewardRedemption, AgentRewardRedemption } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

// Helper to generate UUIDs
function generateUuid(): string {
  return uuidv4();
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Role operations
  getRoles(): Promise<Role[]>;
  getRole(id: string): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: string, updates: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: string): Promise<boolean>;

  // Agent Profile operations
  getAgentProfiles(): Promise<AgentProfile[]>;
  getAgentProfile(id: string): Promise<AgentProfile | undefined>;
  createAgentProfile(agentProfile: InsertAgentProfile): Promise<AgentProfile>;
  updateAgentProfile(id: string, updates: Partial<InsertAgentProfile>): Promise<AgentProfile | undefined>;
  deleteAgentProfile(id: string): Promise<boolean>;

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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  // Role operations
  async getRoles(): Promise<Role[]> {
    const roles = await db.select().from(roles);
    return roles.map((role) => ({ ...role, id: role.id.toString() }));
  }

  async getRole(id: string): Promise<Role | undefined> {
    const role = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
    return role.length > 0 ? role[0] : undefined;
  }

  async createRole(role: InsertRole): Promise<Role> {
    const [createdRole] = await db.insert(roles).values(role).returning();
    return { ...createdRole, id: createdRole.id.toString() };
  }

  async updateRole(id: string, updates: Partial<InsertRole>): Promise<Role | undefined> {
    const [updatedRole] = await db.update(roles).set(updates).where(eq(roles.id, id)).returning();
    return updatedRole ? { ...updatedRole, id: updatedRole.id.toString() } : undefined;
  }

  async deleteRole(id: string): Promise<boolean> {
    const result = await db.delete(roles).where(eq(roles.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Agent Profile operations
  async getAgentProfiles(): Promise<AgentProfile[]> {
    const agentProfiles = await db.select().from(agentProfiles);
    return agentProfiles.map((profile) => ({ ...profile, id: profile.id.toString() }));
  }

  async getAgentProfile(id: string): Promise<AgentProfile | undefined> {
    const profile = await db.select().from(agentProfiles).where(eq(agentProfiles.id, id)).limit(1);
    return profile.length > 0 ? { ...profile[0], id: profile[0].id.toString() } : undefined;
  }

  async createAgentProfile(agentProfile: InsertAgentProfile): Promise<AgentProfile> {
    const [createdProfile] = await db.insert(agentProfiles).values(agentProfile).returning();
    return { ...createdProfile, id: createdProfile.id.toString() };
  }

  async updateAgentProfile(id: string, updates: Partial<InsertAgentProfile>): Promise<AgentProfile | undefined> {
    const [updatedProfile] = await db.update(agentProfiles).set(updates).where(eq(agentProfiles.id, id)).returning();
    return updatedProfile ? { ...updatedProfile, id: updatedProfile.id.toString() } : undefined;
  }

  async deleteAgentProfile(id: string): Promise<boolean> {
    const result = await db.delete(agentProfiles).where(eq(agentProfiles.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    const packages = await db.select().from(packages);
    return packages.map((pack) => ({ ...pack, id: pack.id.toString() }));
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const pack = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
    return pack.length > 0 ? { ...pack[0], id: pack[0].id.toString() } : undefined;
  }

  async getPackagesByDestination(destinationId: number): Promise<Package[]> {
    const packages = await db.select().from(packages).where(eq(packages.destinationId, destinationId));
    return packages.map((pack) => ({ ...pack, id: pack.id.toString() }));
  }

  async getFeaturedPackages(limit: number): Promise<Package[]> {
    const packages = await db.select().from(packages).limit(limit);
    return packages.map((pack) => ({ ...pack, id: pack.id.toString() }));
  }

  async searchPackages(query: string): Promise<Package[]> {
    const packages = await db.select().from(packages).where(like(packages.name, `%${query}%`));
    return packages.map((pack) => ({ ...pack, id: pack.id.toString() }));
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    const destinations = await db.select().from(destinations);
    return destinations.map((destination) => ({ ...destination, id: destination.id.toString() }));
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    const destination = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
    return destination.length > 0 ? { ...destination[0], id: destination[0].id.toString() } : undefined;
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [createdDestination] = await db.insert(destinations).values(destination).returning();
    return { ...createdDestination, id: createdDestination.id.toString() };
  }

  async updateDestination(id: string, updates: Partial<InsertDestination>): Promise<Destination | undefined> {
    const [updatedDestination] = await db.update(destinations).set(updates).where(eq(destinations.id, id)).returning();
    return updatedDestination ? { ...updatedDestination, id: updatedDestination.id.toString() } : undefined;
  }

  async deleteDestination(id: string): Promise<boolean> {
    const result = await db.delete(destinations).where(eq(destinations.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Special Offer operations
  async getSpecialOffers(limit: number): Promise<SpecialOffer[]> {
    const specialOffers = await db.select().from(specialOffers).limit(limit);
    return specialOffers.map((offer) => ({ ...offer, id: offer.id.toString() }));
  }

  async getSpecialOffer(id: string): Promise<SpecialOffer | undefined> {
    const offer = await db.select().from(specialOffers).where(eq(specialOffers.id, id)).limit(1);
    return offer.length > 0 ? { ...offer[0], id: offer[0].id.toString() } : undefined;
  }

  async createSpecialOffer(specialOffer: InsertSpecialOffer): Promise<SpecialOffer> {
    const [createdOffer] = await db.insert(specialOffers).values(specialOffer).returning();
    return { ...createdOffer, id: createdOffer.id.toString() };
  }

  async updateSpecialOffer(id: string, updates: Partial<InsertSpecialOffer>): Promise<SpecialOffer | undefined> {
    const [updatedOffer] = await db.update(specialOffers).set(updates).where(eq(specialOffers.id, id)).returning();
    return updatedOffer ? { ...updatedOffer, id: updatedOffer.id.toString() } : undefined;
  }

  async deleteSpecialOffer(id: string): Promise<boolean> {
    const result = await db.delete(specialOffers).where(eq(specialOffers.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Testimonial operations
  async getTestimonials(limit: number): Promise<Testimonial[]> {
    const testimonials = await db.select().from(testimonials).limit(limit);
    return testimonials.map((testimonial) => ({ ...testimonial, id: testimonial.id.toString() }));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const testimonial = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return testimonial.length > 0 ? { ...testimonial[0], id: testimonial[0].id.toString() } : undefined;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [createdTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return { ...createdTestimonial, id: createdTestimonial.id.toString() };
  }

  async updateTestimonial(id: string, updates: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db.update(testimonials).set(updates).where(eq(testimonials.id, id)).returning();
    return updatedTestimonial ? { ...updatedTestimonial, id: updatedTestimonial.id.toString() } : undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Hotel operations
  async getHotels(): Promise<Hotel[]> {
    const hotels = await db.select().from(hotels);
    return hotels.map((hotel) => ({ ...hotel, id: hotel.id.toString() }));
  }

  async getHotel(id: string): Promise<Hotel | undefined> {
    const hotel = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1);
    return hotel.length > 0 ? { ...hotel[0], id: hotel[0].id.toString() } : undefined;
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const [createdHotel] = await db.insert(hotels).values(hotel).returning();
    return { ...createdHotel, id: createdHotel.id.toString() };
  }

  async updateHotel(id: string, updates: Partial<InsertHotel>): Promise<Hotel | undefined> {
    const [updatedHotel] = await db.update(hotels).set(updates).where(eq(hotels.id, id)).returning();
    return updatedHotel ? { ...updatedHotel, id: updatedHotel.id.toString() } : undefined;
  }

  async deleteHotel(id: string): Promise<boolean> {
    const result = await db.delete(hotels).where(eq(hotels.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Tour operations
  async getTours(): Promise<Tour[]> {
    const tours = await db.select().from(tours);
    return tours.map((tour) => ({ ...tour, id: tour.id.toString() }));
  }

  async getTour(id: string): Promise<Tour | undefined> {
    const tour = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
    return tour.length > 0 ? { ...tour[0], id: tour[0].id.toString() } : undefined;
  }

  async createTour(tour: InsertTour): Promise<Tour> {
    const [createdTour] = await db.insert(tours).values(tour).returning();
    return { ...createdTour, id: createdTour.id.toString() };
  }

  async updateTour(id: string, updates: Partial<InsertTour>): Promise<Tour | undefined> {
    const [updatedTour] = await db.update(tours).set(updates).where(eq(tours.id, id)).returning();
    return updatedTour ? { ...updatedTour, id: updatedTour.id.toString() } : undefined;
  }

  async deleteTour(id: string): Promise<boolean> {
    const result = await db.delete(tours).where(eq(tours.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Comment operations
  async getComments(): Promise<Comment[]> {
    const comments = await db.select().from(comments);
    return comments.map((comment) => ({ ...comment, id: comment.id.toString() }));
  }

  async getComment(id: string): Promise<Comment | undefined> {
    const comment = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
    return comment.length > 0 ? { ...comment[0], id: comment[0].id.toString() } : undefined;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [createdComment] = await db.insert(comments).values(comment).returning();
    return { ...createdComment, id: createdComment.id.toString() };
  }

  async updateComment(id: string, updates: Partial<InsertComment>): Promise<Comment | undefined> {
    const [updatedComment] = await db.update(comments).set(updates).where(eq(comments.id, id)).returning();
    return updatedComment ? { ...updatedComment, id: updatedComment.id.toString() } : undefined;
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Reply operations
  async getReplies(): Promise<Reply[]> {
    const replies = await db.select().from(replies);
    return replies.map((reply) => ({ ...reply, id: reply.id.toString() }));
  }

  async getReply(id: string): Promise<Reply | undefined> {
    const reply = await db.select().from(replies).where(eq(replies.id, id)).limit(1);
    return reply.length > 0 ? { ...reply[0], id: reply[0].id.toString() } : undefined;
  }

  async createReply(reply: InsertReply): Promise<Reply> {
    const [createdReply] = await db.insert(replies).values(reply).returning();
    return { ...createdReply, id: createdReply.id.toString() };
  }

  async updateReply(id: string, updates: Partial<InsertReply>): Promise<Reply | undefined> {
    const [updatedReply] = await db.update(replies).set(updates).where(eq(replies.id, id)).returning();
    return updatedReply ? { ...updatedReply, id: updatedReply.id.toString() } : undefined;
  }

  async deleteReply(id: string): Promise<boolean> {
    const result = await db.delete(replies).where(eq(replies.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    const bookings = await db.select().from(bookings);
    return bookings.map((booking) => ({ ...booking, id: booking.id.toString() }));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const booking = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return booking.length > 0 ? { ...booking[0], id: booking[0].id.toString() } : undefined;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [createdBooking] = await db.insert(bookings).values(booking).returning();
    return { ...createdBooking, id: createdBooking.id.toString() };
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return updatedBooking ? { ...updatedBooking, id: updatedBooking.id.toString() } : undefined;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    const payments = await db.select().from(payments);
    return payments.map((payment) => ({ ...payment, id: payment.id.toString() }));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const payment = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return payment.length > 0 ? { ...payment[0], id: payment[0].id.toString() } : undefined;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [createdPayment] = await db.insert(payments).values(payment).returning();
    return { ...createdPayment, id: createdPayment.id.toString() };
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return updatedPayment ? { ...updatedPayment, id: updatedPayment.id.toString() } : undefined;
  }

  async deletePayment(id: string): Promise<boolean> {
    const result = await db.delete(payments).where(eq(payments.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Hotel Owner Profile operations
  async getHotelOwnerProfiles(): Promise<HotelOwnerProfile[]> {
    const hotelOwnerProfiles = await db.select().from(hotelOwnerProfiles);
    return hotelOwnerProfiles.map((profile) => ({ ...profile, id: profile.id.toString() }));
  }

  async getHotelOwnerProfile(id: string): Promise<HotelOwnerProfile | undefined> {
    const profile = await db.select().from(hotelOwnerProfiles).where(eq(hotelOwnerProfiles.id, id)).limit(1);
    return profile.length > 0 ? { ...profile[0], id: profile[0].id.toString() } : undefined;
  }

  async createHotelOwnerProfile(hotelOwnerProfile: InsertHotelOwnerProfile): Promise<HotelOwnerProfile> {
    const [createdProfile] = await db.insert(hotelOwnerProfiles).values(hotelOwnerProfile).returning();
    return { ...createdProfile, id: createdProfile.id.toString() };
  }

  async updateHotelOwnerProfile(id: string, updates: Partial<InsertHotelOwnerProfile>): Promise<HotelOwnerProfile | undefined> {
    const [updatedProfile] = await db.update(hotelOwnerProfiles).set(updates).where(eq(hotelOwnerProfiles.id, id)).returning();
    return updatedProfile ? { ...updatedProfile, id: updatedProfile.id.toString() } : undefined;
  }

  async deleteHotelOwnerProfile(id: string): Promise<boolean> {
    const result = await db.delete(hotelOwnerProfiles).where(eq(hotelOwnerProfiles.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Hotel Ownership operations
  async getHotelOwnerships(): Promise<HotelOwnership[]> {
    const hotelOwnerships = await db.select().from(hotelOwnerships);
    return hotelOwnerships.map((ownership) => ({ ...ownership, id: ownership.id.toString() }));
  }

  async getHotelOwnership(id: string): Promise<HotelOwnership | undefined> {
    const ownership = await db.select().from(hotelOwnerships).where(eq(hotelOwnerships.id, id)).limit(1);
    return ownership.length > 0 ? { ...ownership[0], id: ownership[0].id.toString() } : undefined;
  }

  async createHotelOwnership(hotelOwnership: InsertHotelOwnership): Promise<HotelOwnership> {
    const [createdOwnership] = await db.insert(hotelOwnerships).values(hotelOwnership).returning();
    return { ...createdOwnership, id: createdOwnership.id.toString() };
  }

  async updateHotelOwnership(id: string, updates: Partial<InsertHotelOwnership>): Promise<HotelOwnership | undefined> {
    const [updatedOwnership] = await db.update(hotelOwnerships).set(updates).where(eq(hotelOwnerships.id, id)).returning();
    return updatedOwnership ? { ...updatedOwnership, id: updatedOwnership.id.toString() } : undefined;
  }

  async deleteHotelOwnership(id: string): Promise<boolean> {
    const result = await db.delete(hotelOwnerships).where(eq(hotelOwnerships.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Agent Reward Point operations
  async getAgentRewardPoints(): Promise<AgentRewardPoint[]> {
    const agentRewardPoints = await db.select().from(agentRewardPoints);
    return agentRewardPoints.map((point) => ({ ...point, id: point.id.toString() }));
  }

  async getAgentRewardPoint(id: string): Promise<AgentRewardPoint | undefined> {
    const point = await db.select().from(agentRewardPoints).where(eq(agentRewardPoints.id, id)).limit(1);
    return point.length > 0 ? { ...point[0], id: point[0].id.toString() } : undefined;
  }

  async createAgentRewardPoint(agentRewardPoint: InsertAgentRewardPoint): Promise<AgentRewardPoint> {
    const [createdPoint] = await db.insert(agentRewardPoints).values(agentRewardPoint).returning();
    return { ...createdPoint, id: createdPoint.id.toString() };
  }

  async updateAgentRewardPoint(id: string, updates: Partial<InsertAgentRewardPoint>): Promise<AgentRewardPoint | undefined> {
    const [updatedPoint] = await db.update(agentRewardPoints).set(updates).where(eq(agentRewardPoints.id, id)).returning();
    return updatedPoint ? { ...updatedPoint, id: updatedPoint.id.toString() } : undefined;
  }

  async deleteAgentRewardPoint(id: string): Promise<boolean> {
    const result = await db.delete(agentRewardPoints).where(eq(agentRewardPoints.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Agent Point Transaction operations
  async getAgentPointTransactions(): Promise<AgentPointTransaction[]> {
    const agentPointTransactions = await db.select().from(agentPointTransactions);
    return agentPointTransactions.map((transaction) => ({ ...transaction, id: transaction.id.toString() }));
  }

  async getAgentPointTransaction(id: string): Promise<AgentPointTransaction | undefined> {
    const transaction = await db.select().from(agentPointTransactions).where(eq(agentPointTransactions.id, id)).limit(1);
    return transaction.length > 0 ? { ...transaction[0], id: transaction[0].id.toString() } : undefined;
  }

  async createAgentPointTransaction(agentPointTransaction: InsertAgentPointTransaction): Promise<AgentPointTransaction> {
    const [createdTransaction] = await db.insert(agentPointTransactions).values(agentPointTransaction).returning();
    return { ...createdTransaction, id: createdTransaction.id.toString() };
  }

  async updateAgentPointTransaction(id: string, updates: Partial<InsertAgentPointTransaction>): Promise<AgentPointTransaction | undefined> {
    const [updatedTransaction] = await db.update(agentPointTransactions).set(updates).where(eq(agentPointTransactions.id, id)).returning();
    return updatedTransaction ? { ...updatedTransaction, id: updatedTransaction.id.toString() } : undefined;
  }

  async deleteAgentPointTransaction(id: string): Promise<boolean> {
    const result = await db.delete(agentPointTransactions).where(eq(agentPointTransactions.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }

  // Agent Reward Redemption operations
  async getAgentRewardRedemptions(): Promise<AgentRewardRedemption[]> {
    const agentRewardRedemptions = await db.select().from(agentRewardRedemptions);
    return agentRewardRedemptions.map((redemption) => ({ ...redemption, id: redemption.id.toString() }));
  }

  async getAgentRewardRedemption(id: string): Promise<AgentRewardRedemption | undefined> {
    const redemption = await db.select().from(agentRewardRedemptions).where(eq(agentRewardRedemptions.id, id)).limit(1);
    return redemption.length > 0 ? { ...redemption[0], id: redemption[0].id.toString() } : undefined;
  }

  async createAgentRewardRedemption(agentRewardRedemption: InsertAgentRewardRedemption): Promise<AgentRewardRedemption> {
    const [createdRedemption] = await db.insert(agentRewardRedemptions).values(agentRewardRedemption).returning();
    return { ...createdRedemption, id: createdRedemption.id.toString() };
  }

  async updateAgentRewardRedemption(id: string, updates: Partial<InsertAgentRewardRedemption>): Promise<AgentRewardRedemption | undefined> {
    const [updatedRedemption] = await db.update(agentRewardRedemptions).set(updates).where(eq(agentRewardRedemptions.id, id)).returning();
    return updatedRedemption ? { ...updatedRedemption, id: updatedRedemption.id.toString() } : undefined;
  }

  async deleteAgentRewardRedemption(id: string): Promise<boolean> {
    const result = await db.delete(agentRewardRedemptions).where(eq(agentRewardRedemptions.id, id)).returning({ count: sql<number>`count(*)` });
    return result[0].count > 0;
  }
}

export { DatabaseStorage };

// Use DatabaseStorage for production database
// Use in-memory storage for now while we troubleshoot database connection
export const storage = new MemStorage();
