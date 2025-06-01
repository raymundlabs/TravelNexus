import { InsertAgentProfile, InsertPackage, InsertDestination, InsertSpecialOffer, InsertTestimonial, InsertHotel, InsertTour, InsertRole, AgentProfile, Package, Destination, SpecialOffer, Testimonial, Hotel, Tour, Role, InsertComment, Comment, InsertReply, Reply, InsertBooking, Booking, InsertPayment, Payment, InsertHotelOwnerProfile, HotelOwnerProfile, InsertHotelOwnership, HotelOwnership, InsertAgentRewardPoint, AgentRewardPoint, InsertAgentPointTransaction, AgentPointTransaction, InsertAgentRewardRedemption, AgentRewardRedemption } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

// Helper to generate UUIDs
function generateUuid(): string {
  return uuidv4();
}

export interface Storage {
  // User operations (now primarily handled by Supabase Auth)
  // getUser(id: string): Promise<User | undefined>; // Supabase Auth handles this
  // createUser(user: InsertUser): Promise<User>; // Supabase Auth handles this
  // getUserByUsername(username: string): Promise<User | undefined>; // Supabase Auth handles this with email
  // getUserByEmail(email: string): Promise<User | undefined>; // Supabase Auth handles this
  // updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>; // Supabase Auth handles this
  // deleteUser(id: string): Promise<boolean>; // Supabase Auth handles this

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
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pack: InsertPackage): Promise<Package>;
  updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;

  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: string, updates: Partial<InsertDestination>): Promise<Destination | undefined>;
  deleteDestination(id: string): Promise<boolean>;

  // Special Offer operations
  getSpecialOffers(): Promise<SpecialOffer[]>;
  getSpecialOffer(id: string): Promise<SpecialOffer | undefined>;
  createSpecialOffer(specialOffer: InsertSpecialOffer): Promise<SpecialOffer>;
  updateSpecialOffer(id: string, updates: Partial<InsertSpecialOffer>): Promise<SpecialOffer | undefined>;
  deleteSpecialOffer(id: string): Promise<boolean>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, updates: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Hotel operations
  getHotels(): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: string, updates: Partial<InsertHotel>): Promise<Hotel | undefined>;
  deleteHotel(id: string): Promise<boolean>;

  // Tour operations
  getTours(): Promise<Tour[]>;
  getTour(id: string): Promise<Tour | undefined>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: string, updates: Partial<InsertTour>): Promise<Tour | undefined>;
  deleteTour(id: string): Promise<boolean>;

  // Comment operations
  getComments(): Promise<Comment[]>;
  getComment(id: string): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: string, updates: Partial<InsertComment>): Promise<Comment | undefined>;
  deleteComment(id: string): Promise<boolean>;

  // Reply operations
  getReplies(): Promise<Reply[]>;
  getReply(id: string): Promise<Reply | undefined>;
  createReply(reply: InsertReply): Promise<Reply>;
  updateReply(id: string, updates: Partial<InsertReply>): Promise<Reply | undefined>;
  deleteReply(id: string): Promise<boolean>;

  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: string): Promise<boolean>;

  // Hotel Owner Profile operations
  getHotelOwnerProfiles(): Promise<HotelOwnerProfile[]>;
  getHotelOwnerProfile(id: string): Promise<HotelOwnerProfile | undefined>;
  createHotelOwnerProfile(hotelOwnerProfile: InsertHotelOwnerProfile): Promise<HotelOwnerProfile>;
  updateHotelOwnerProfile(id: string, updates: Partial<InsertHotelOwnerProfile>): Promise<HotelOwnerProfile | undefined>;
  deleteHotelOwnerProfile(id: string): Promise<boolean>;

  // Hotel Ownership operations
  getHotelOwnerships(): Promise<HotelOwnership[]>;
  getHotelOwnership(id: string): Promise<HotelOwnership | undefined>;
  createHotelOwnership(hotelOwnership: InsertHotelOwnership): Promise<HotelOwnership>;
  updateHotelOwnership(id: string, updates: Partial<InsertHotelOwnership>): Promise<HotelOwnership | undefined>;
  deleteHotelOwnership(id: string): Promise<boolean>;

  // Agent Reward Point operations
  getAgentRewardPoints(): Promise<AgentRewardPoint[]>;
  getAgentRewardPoint(id: string): Promise<AgentRewardPoint | undefined>;
  createAgentRewardPoint(agentRewardPoint: InsertAgentRewardPoint): Promise<AgentRewardPoint>;
  updateAgentRewardPoint(id: string, updates: Partial<InsertAgentRewardPoint>): Promise<AgentRewardPoint | undefined>;
  deleteAgentRewardPoint(id: string): Promise<boolean>;

  // Agent Point Transaction operations
  getAgentPointTransactions(): Promise<AgentPointTransaction[]>;
  getAgentPointTransaction(id: string): Promise<AgentPointTransaction | undefined>;
  createAgentPointTransaction(agentPointTransaction: InsertAgentPointTransaction): Promise<AgentPointTransaction>;
  updateAgentPointTransaction(id: string, updates: Partial<InsertAgentPointTransaction>): Promise<AgentPointTransaction | undefined>;
  deleteAgentPointTransaction(id: string): Promise<boolean>;

  // Agent Reward Redemption operations
  getAgentRewardRedemptions(): Promise<AgentRewardRedemption[]>;
  getAgentRewardRedemption(id: string): Promise<AgentRewardRedemption | undefined>;
  createAgentRewardRedemption(agentRewardRedemption: InsertAgentRewardRedemption): Promise<AgentRewardRedemption>;
  updateAgentRewardRedemption(id: string, updates: Partial<InsertAgentRewardRedemption>): Promise<AgentRewardRedemption | undefined>;
  deleteAgentRewardRedemption(id: string): Promise<boolean>;
}

export class MemStorage implements Storage {
  private roles: Map<string, Role>;
  private agentProfiles: Map<string, AgentProfile>;
  private packages: Map<string, Package>;
  private destinations: Map<string, Destination>;
  private specialOffers: Map<string, SpecialOffer>;
  private testimonials: Map<string, Testimonial>;
  private hotels: Map<string, Hotel>;
  private tours: Map<string, Tour>;
  private comments: Map<string, Comment>;
  private replies: Map<string, Reply>;
  private bookings: Map<string, Booking>;
  private payments: Map<string, Payment>;
  private hotelOwnerProfiles: Map<string, HotelOwnerProfile>;
  private hotelOwnership: Map<string, HotelOwnership>;
  private agentRewardPoints: Map<string, AgentRewardPoint>;
  private agentPointTransactions: Map<string, AgentPointTransaction>;
  private agentRewardRedemptions: Map<string, AgentRewardRedemption>;

  constructor() {
    this.roles = new Map();
    this.agentProfiles = new Map();
    this.packages = new Map();
    this.destinations = new Map();
    this.specialOffers = new Map();
    this.testimonials = new Map();
    this.hotels = new Map();
    this.tours = new Map();
    this.comments = new Map();
    this.replies = new Map();
    this.bookings = new Map();
    this.payments = new Map();
    this.hotelOwnerProfiles = new Map();
    this.hotelOwnership = new Map();
    this.agentRewardPoints = new Map();
    this.agentPointTransactions = new Map();
    this.agentRewardRedemptions = new Map();
  }

  // User operations are now handled by Supabase Auth, so we don't need a `getUser` method here.
  async getUser(id: string): Promise<any> {
    // This method is primarily for compatibility if other parts of the code expect a Storage.getUser
    // However, for Supabase Auth, you'd typically get the user via supabase.auth.getUser() on the server.
    console.warn("MemStorage.getUser is deprecated. Use supabase.auth.getUser() instead.");
    return undefined; // Or throw an error if you want to enforce direct Supabase Auth usage
  }

  async getUserByUsername(username: string): Promise<any> {
    console.warn("MemStorage.getUserByUsername is deprecated. Use supabase.auth.getUser() with email instead.");
    return undefined;
  }

  async createUser(user: any): Promise<any> {
    console.warn("MemStorage.createUser is deprecated. Use supabase.auth.signUp() instead.");
    return undefined;
  }

  // Role operations
  async getRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async getRole(id: string): Promise<Role | undefined> {
    return this.roles.get(id);
  }

  async createRole(role: InsertRole): Promise<Role> {
    const newRole = { ...role, id: generateUuid() };
    this.roles = this.roles.set(newRole.id, newRole);
    return newRole;
  }

  async updateRole(id: string, updates: Partial<InsertRole>): Promise<Role | undefined> {
    let role = this.roles.get(id);
    if (!role) {
      return undefined;
    }
    role = { ...role, ...updates };
    this.roles = this.roles.set(id, role);
    return role;
  }

  async deleteRole(id: string): Promise<boolean> {
    const initialSize = this.roles.size;
    this.roles = this.roles.delete(id);
    return this.roles.size < initialSize;
  }

  // Agent Profile operations
  async getAgentProfiles(): Promise<AgentProfile[]> {
    return Array.from(this.agentProfiles.values());
  }

  async getAgentProfile(id: string): Promise<AgentProfile | undefined> {
    return this.agentProfiles.get(id);
  }

  async createAgentProfile(agentProfile: InsertAgentProfile): Promise<AgentProfile> {
    const newAgentProfile = { ...agentProfile, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.agentProfiles = this.agentProfiles.set(newAgentProfile.id, newAgentProfile);
    return newAgentProfile;
  }

  async updateAgentProfile(id: string, updates: Partial<InsertAgentProfile>): Promise<AgentProfile | undefined> {
    let agentProfile = this.agentProfiles.get(id);
    if (!agentProfile) {
      return undefined;
    }
    agentProfile = { ...agentProfile, ...updates, updated_at: new Date() };
    this.agentProfiles = this.agentProfiles.set(id, agentProfile);
    return agentProfile;
  }

  async deleteAgentProfile(id: string): Promise<boolean> {
    const initialSize = this.agentProfiles.size;
    this.agentProfiles = this.agentProfiles.delete(id);
    return this.agentProfiles.size < initialSize;
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(pack: InsertPackage): Promise<Package> {
    const newPackage: Package = { ...pack, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.packages = this.packages.set(newPackage.id, newPackage);
    return newPackage;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    let pack = this.packages.get(id);
    if (!pack) {
      return undefined;
    }
    pack = { ...pack, ...updates, updated_at: new Date() };
    this.packages = this.packages.set(id, pack);
    return pack;
  }

  async deletePackage(id: string): Promise<boolean> {
    const initialSize = this.packages.size;
    this.packages = this.packages.delete(id);
    return this.packages.size < initialSize;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const newDestination: Destination = { ...destination, id: generateUuid(), created_at: new Date(), updated_at: new Date(), featured: destination.featured || false };
    this.destinations = this.destinations.set(newDestination.id, newDestination);
    return newDestination;
  }

  async updateDestination(id: string, updates: Partial<InsertDestination>): Promise<Destination | undefined> {
    let destination = this.destinations.get(id);
    if (!destination) {
      return undefined;
    }
    destination = { ...destination, ...updates, updated_at: new Date() };
    this.destinations = this.destinations.set(id, destination);
    return destination;
  }

  async deleteDestination(id: string): Promise<boolean> {
    const initialSize = this.destinations.size;
    this.destinations = this.destinations.delete(id);
    return this.destinations.size < initialSize;
  }

  // Special Offer operations
  async getSpecialOffers(): Promise<SpecialOffer[]> {
    return Array.from(this.specialOffers.values());
  }

  async getSpecialOffer(id: string): Promise<SpecialOffer | undefined> {
    return this.specialOffers.get(id);
  }

  async createSpecialOffer(specialOffer: InsertSpecialOffer): Promise<SpecialOffer> {
    const newSpecialOffer = { ...specialOffer, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.specialOffers = this.specialOffers.set(newSpecialOffer.id, newSpecialOffer);
    return newSpecialOffer;
  }

  async updateSpecialOffer(id: string, updates: Partial<InsertSpecialOffer>): Promise<SpecialOffer | undefined> {
    let specialOffer = this.specialOffers.get(id);
    if (!specialOffer) {
      return undefined;
    }
    specialOffer = { ...specialOffer, ...updates, updated_at: new Date() };
    this.specialOffers = this.specialOffers.set(id, specialOffer);
    return specialOffer;
  }

  async deleteSpecialOffer(id: string): Promise<boolean> {
    const initialSize = this.specialOffers.size;
    this.specialOffers = this.specialOffers.delete(id);
    return this.specialOffers.size < initialSize;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const newTestimonial = { ...testimonial, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.testimonials = this.testimonials.set(newTestimonial.id, newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: string, updates: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    let testimonial = this.testimonials.get(id);
    if (!testimonial) {
      return undefined;
    }
    testimonial = { ...testimonial, ...updates, updated_at: new Date() };
    this.testimonials = this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const initialSize = this.testimonials.size;
    this.testimonials = this.testimonials.delete(id);
    return this.testimonials.size < initialSize;
  }

  // Hotel operations
  async getHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async getHotel(id: string): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const newHotel: Hotel = { ...hotel, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.hotels = this.hotels.set(newHotel.id, newHotel);
    return newHotel;
  }

  async updateHotel(id: string, updates: Partial<InsertHotel>): Promise<Hotel | undefined> {
    let hotel = this.hotels.get(id);
    if (!hotel) {
      return undefined;
    }
    hotel = { ...hotel, ...updates, updated_at: new Date() };
    this.hotels = this.hotels.set(id, hotel);
    return hotel;
  }

  async deleteHotel(id: string): Promise<boolean> {
    const initialSize = this.hotels.size;
    this.hotels = this.hotels.delete(id);
    return this.hotels.size < initialSize;
  }

  // Tour operations
  async getTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getTour(id: string): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async createTour(tour: InsertTour): Promise<Tour> {
    const newTour: Tour = { ...tour, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.tours = this.tours.set(newTour.id, newTour);
    return newTour;
  }

  async updateTour(id: string, updates: Partial<InsertTour>): Promise<Tour | undefined> {
    let tour = this.tours.get(id);
    if (!tour) {
      return undefined;
    }
    tour = { ...tour, ...updates, updated_at: new Date() };
    this.tours = this.tours.set(id, tour);
    return tour;
  }

  async deleteTour(id: string): Promise<boolean> {
    const initialSize = this.tours.size;
    this.tours = this.tours.delete(id);
    return this.tours.size < initialSize;
  }

  // Comment operations
  async getComments(): Promise<Comment[]> {
    return Array.from(this.comments.values());
  }

  async getComment(id: string): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const newComment = { ...comment, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.comments = this.comments.set(newComment.id, newComment);
    return newComment;
  }

  async updateComment(id: string, updates: Partial<InsertComment>): Promise<Comment | undefined> {
    let comment = this.comments.get(id);
    if (!comment) {
      return undefined;
    }
    comment = { ...comment, ...updates, updated_at: new Date() };
    this.comments = this.comments.set(id, comment);
    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const initialSize = this.comments.size;
    this.comments = this.comments.delete(id);
    return this.comments.size < initialSize;
  }

  // Reply operations
  async getReplies(): Promise<Reply[]> {
    return Array.from(this.replies.values());
  }

  async getReply(id: string): Promise<Reply | undefined> {
    return this.replies.get(id);
  }

  async createReply(reply: InsertReply): Promise<Reply> {
    const newReply = { ...reply, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.replies = this.replies.set(newReply.id, newReply);
    return newReply;
  }

  async updateReply(id: string, updates: Partial<InsertReply>): Promise<Reply | undefined> {
    let reply = this.replies.get(id);
    if (!reply) {
      return undefined;
    }
    reply = { ...reply, ...updates, updated_at: new Date() };
    this.replies = this.replies.set(id, reply);
    return reply;
  }

  async deleteReply(id: string): Promise<boolean> {
    const initialSize = this.replies.size;
    this.replies = this.replies.delete(id);
    return this.replies.size < initialSize;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const newBooking = { ...booking, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.bookings = this.bookings.set(newBooking.id, newBooking);
    return newBooking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    let booking = this.bookings.get(id);
    if (!booking) {
      return undefined;
    }
    booking = { ...booking, ...updates, updated_at: new Date() };
    this.bookings = this.bookings.set(id, booking);
    return booking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const initialSize = this.bookings.size;
    this.bookings = this.bookings.delete(id);
    return this.bookings.size < initialSize;
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const newPayment = { ...payment, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.payments = this.payments.set(newPayment.id, newPayment);
    return newPayment;
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    let payment = this.payments.get(id);
    if (!payment) {
      return undefined;
    }
    payment = { ...payment, ...updates, updated_at: new Date() };
    this.payments = this.payments.set(id, payment);
    return payment;
  }

  async deletePayment(id: string): Promise<boolean> {
    const initialSize = this.payments.size;
    this.payments = this.payments.delete(id);
    return this.payments.size < initialSize;
  }

  // Hotel Owner Profile operations
  async getHotelOwnerProfiles(): Promise<HotelOwnerProfile[]> {
    return Array.from(this.hotelOwnerProfiles.values());
  }

  async getHotelOwnerProfile(id: string): Promise<HotelOwnerProfile | undefined> {
    return this.hotelOwnerProfiles.get(id);
  }

  async createHotelOwnerProfile(hotelOwnerProfile: InsertHotelOwnerProfile): Promise<HotelOwnerProfile> {
    const newHotelOwnerProfile = { ...hotelOwnerProfile, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.hotelOwnerProfiles = this.hotelOwnerProfiles.set(newHotelOwnerProfile.id, newHotelOwnerProfile);
    return newHotelOwnerProfile;
  }

  async updateHotelOwnerProfile(id: string, updates: Partial<InsertHotelOwnerProfile>): Promise<HotelOwnerProfile | undefined> {
    let hotelOwnerProfile = this.hotelOwnerProfiles.get(id);
    if (!hotelOwnerProfile) {
      return undefined;
    }
    hotelOwnerProfile = { ...hotelOwnerProfile, ...updates, updated_at: new Date() };
    this.hotelOwnerProfiles = this.hotelOwnerProfiles.set(id, hotelOwnerProfile);
    return hotelOwnerProfile;
  }

  async deleteHotelOwnerProfile(id: string): Promise<boolean> {
    const initialSize = this.hotelOwnerProfiles.size;
    this.hotelOwnerProfiles = this.hotelOwnerProfiles.delete(id);
    return this.hotelOwnerProfiles.size < initialSize;
  }

  // Hotel Ownership operations
  async getHotelOwnerships(): Promise<HotelOwnership[]> {
    return Array.from(this.hotelOwnership.values());
  }

  async getHotelOwnership(id: string): Promise<HotelOwnership | undefined> {
    return this.hotelOwnership.get(id);
  }

  async createHotelOwnership(hotelOwnership: InsertHotelOwnership): Promise<HotelOwnership> {
    const newHotelOwnership = { ...hotelOwnership, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.hotelOwnership = this.hotelOwnership.set(newHotelOwnership.id, newHotelOwnership);
    return newHotelOwnership;
  }

  async updateHotelOwnership(id: string, updates: Partial<InsertHotelOwnership>): Promise<HotelOwnership | undefined> {
    let hotelOwnership = this.hotelOwnership.get(id);
    if (!hotelOwnership) {
      return undefined;
    }
    hotelOwnership = { ...hotelOwnership, ...updates, updated_at: new Date() };
    this.hotelOwnership = this.hotelOwnership.set(id, hotelOwnership);
    return hotelOwnership;
  }

  async deleteHotelOwnership(id: string): Promise<boolean> {
    const initialSize = this.hotelOwnership.size;
    this.hotelOwnership = this.hotelOwnership.delete(id);
    return this.hotelOwnership.size < initialSize;
  }

  // Agent Reward Point operations
  async getAgentRewardPoints(): Promise<AgentRewardPoint[]> {
    return Array.from(this.agentRewardPoints.values());
  }

  async getAgentRewardPoint(id: string): Promise<AgentRewardPoint | undefined> {
    return this.agentRewardPoints.get(id);
  }

  async createAgentRewardPoint(agentRewardPoint: InsertAgentRewardPoint): Promise<AgentRewardPoint> {
    const newAgentRewardPoint = { ...agentRewardPoint, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.agentRewardPoints = this.agentRewardPoints.set(newAgentRewardPoint.id, newAgentRewardPoint);
    return newAgentRewardPoint;
  }

  async updateAgentRewardPoint(id: string, updates: Partial<InsertAgentRewardPoint>): Promise<AgentRewardPoint | undefined> {
    let agentRewardPoint = this.agentRewardPoints.get(id);
    if (!agentRewardPoint) {
      return undefined;
    }
    agentRewardPoint = { ...agentRewardPoint, ...updates, updated_at: new Date() };
    this.agentRewardPoints = this.agentRewardPoints.set(id, agentRewardPoint);
    return agentRewardPoint;
  }

  async deleteAgentRewardPoint(id: string): Promise<boolean> {
    const initialSize = this.agentRewardPoints.size;
    this.agentRewardPoints = this.agentRewardPoints.delete(id);
    return this.agentRewardPoints.size < initialSize;
  }

  // Agent Point Transaction operations
  async getAgentPointTransactions(): Promise<AgentPointTransaction[]> {
    return Array.from(this.agentPointTransactions.values());
  }

  async getAgentPointTransaction(id: string): Promise<AgentPointTransaction | undefined> {
    return this.agentPointTransactions.get(id);
  }

  async createAgentPointTransaction(agentPointTransaction: InsertAgentPointTransaction): Promise<AgentPointTransaction> {
    const newAgentPointTransaction = { ...agentPointTransaction, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.agentPointTransactions = this.agentPointTransactions.set(newAgentPointTransaction.id, newAgentPointTransaction);
    return newAgentPointTransaction;
  }

  async updateAgentPointTransaction(id: string, updates: Partial<InsertAgentPointTransaction>): Promise<AgentPointTransaction | undefined> {
    let agentPointTransaction = this.agentPointTransactions.get(id);
    if (!agentPointTransaction) {
      return undefined;
    }
    agentPointTransaction = { ...agentPointTransaction, ...updates, updated_at: new Date() };
    this.agentPointTransactions = this.agentPointTransactions.set(id, agentPointTransaction);
    return agentPointTransaction;
  }

  async deleteAgentPointTransaction(id: string): Promise<boolean> {
    const initialSize = this.agentPointTransactions.size;
    this.agentPointTransactions = this.agentPointTransactions.delete(id);
    return this.agentPointTransactions.size < initialSize;
  }

  // Agent Reward Redemption operations
  async getAgentRewardRedemptions(): Promise<AgentRewardRedemption[]> {
    return Array.from(this.agentRewardRedemptions.values());
  }

  async getAgentRewardRedemption(id: string): Promise<AgentRewardRedemption | undefined> {
    return this.agentRewardRedemptions.get(id);
  }

  async createAgentRewardRedemption(agentRewardRedemption: InsertAgentRewardRedemption): Promise<AgentRewardRedemption> {
    const newAgentRewardRedemption = { ...agentRewardRedemption, id: generateUuid(), created_at: new Date(), updated_at: new Date() };
    this.agentRewardRedemptions = this.agentRewardRedemptions.set(newAgentRewardRedemption.id, newAgentRewardRedemption);
    return newAgentRewardRedemption;
  }

  async updateAgentRewardRedemption(id: string, updates: Partial<InsertAgentRewardRedemption>): Promise<AgentRewardRedemption | undefined> {
    let agentRewardRedemption = this.agentRewardRedemptions.get(id);
    if (!agentRewardRedemption) {
      return undefined;
    }
    agentRewardRedemption = { ...agentRewardRedemption, ...updates, updated_at: new Date() };
    this.agentRewardRedemptions = this.agentRewardRedemptions.set(id, agentRewardRedemption);
    return agentRewardRedemption;
  }

  async deleteAgentRewardRedemption(id: string): Promise<boolean> {
    const initialSize = this.agentRewardRedemptions.size;
    this.agentRewardRedemptions = this.agentRewardRedemptions.delete(id);
    return this.agentRewardRedemptions.size < initialSize;
  }
}

export const storage = new MemStorage(); 