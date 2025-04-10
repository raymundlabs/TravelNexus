// Site constants
export const SITE_NAME = "Wanderlust";
export const SITE_DESCRIPTION = "Discover Your Perfect Getaway";
export const SITE_TAGLINE = "Unforgettable experiences and adventures await with Wanderlust Travel";

// Tab options for search widget
export type BookingTabType = "hotels" | "tours" | "packages";
export const BOOKING_TABS: { label: string; value: BookingTabType; icon: string }[] = [
  { label: "Hotels", value: "hotels", icon: "hotel" },
  { label: "Tours", value: "tours", icon: "map-marked-alt" },
  { label: "Packages", value: "packages", icon: "suitcase" }
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
