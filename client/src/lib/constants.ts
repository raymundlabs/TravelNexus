// Site constants
export const SITE_NAME = "White Beach Puerto Galera Tours";
export const SITE_DESCRIPTION = "Puerto Galera's Most Trusted Tour Booking Site!";
export const SITE_TAGLINE = "The No.1 Site for White Beach Puerto Galera Bookings!";
export const SITE_OPERATOR = "Operated by: MATT TRAVEL";
export const SITE_OPERATOR_SLOGAN = "A Proud Local Travel Provider Since 2016";
export const SITE_URL = "www.whitebeachpuertogaleratours.com";

// Tab options for search widget
export type BookingTabType = "hotels" | "tours" | "packages" | "ferry";
export const BOOKING_TABS: { label: string; value: BookingTabType; icon: string; description?: string }[] = [
  { 
    label: "Tour Packages", 
    value: "packages", 
    icon: "suitcase", 
    description: "Island Hopping • Inland Tours • Waterfalls" 
  },
  { 
    label: "Hotel Reservation", 
    value: "hotels", 
    icon: "bed", 
    description: "Beachfront Hotels • Budget Rooms • Group Rates" 
  },
  { 
    label: "Tours & Activities", 
    value: "tours", 
    icon: "umbrella-beach", 
    description: "Snorkeling • Banana Boat • Diving • ATV" 
  },
  { 
    label: "Ferry Tickets", 
    value: "ferry", 
    icon: "ship", 
    description: "Batangas–Puerto Galera • Roundtrip • VIP & Regular" 
  }
];

// Navigation links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Tours", href: "/tours" },
  { label: "Packages", href: "/packages" },
  { label: "Deals", href: "/deals" }
];

// Footer link groups
export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
    { label: "Gift Cards", href: "#" }
  ],
  support: [
    { label: "Contact Us", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Safety Information", href: "#" },
    { label: "Booking Information", href: "#" },
    { label: "Cancellation Options", href: "#" }
  ],
  legal: [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Accessibility", href: "#" },
    { label: "Sitemap", href: "#" }
  ]
};

// Social media links
export const SOCIAL_LINKS = [
  { icon: "facebook-f", href: "#" },
  { icon: "twitter", href: "#" },
  { icon: "instagram", href: "#" },
  { icon: "pinterest-p", href: "#" }
];

// Payment methods
export const PAYMENT_METHODS = [
  { name: "Visa", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" },
  { name: "Mastercard", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" },
  { name: "PayPal", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg" },
  { name: "Stripe", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" }
];
