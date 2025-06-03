import React from 'react';
import { Link } from 'wouter';
import { Globe, Clock, Star, Tag, ExternalLink } from 'lucide-react';
import { Package as PackageType } from '@/pages/homepage2'; // Import the full Package type

interface PackageCardProps {
  packageData: Omit<PackageType, 'price' | 'image_urls' | 'description' | 'destination_id'> & {
    // Fields from PackageType used directly: id, name, duration, rating, review_count, 
    // discounted_price, is_bestseller, highlights, discount_percentage, featured, num_pax etc.

    // Overridden or new fields for the card's specific needs, provided by parent:
    price: string;       // Expect string price from parent (e.g., "1200.00")
    imageUrl: string;    // Expect specific image URL string from parent
    location: string;    // Expect location display string from parent
    content?: string;    // Optional content summary string from parent
  };
  index?: number; // Index is optional, can be removed if not used for a specific design element
}

const PackageCard: React.FC<PackageCardProps> = ({ packageData }) => {
  const { 
    id, name, location, imageUrl, duration, price, content, 
    rating, review_count, discounted_price, is_bestseller, highlights, discount_percentage 
  } = packageData;

  const displayPrice = discounted_price && discounted_price < parseFloat(price) ? discounted_price : parseFloat(price);
  const originalPrice = discounted_price && discounted_price < parseFloat(price) ? parseFloat(price) : null;

  // Calculate discount percentage if not directly provided but a discounted price exists
  let calculatedDiscountPercentage = discount_percentage;
  if (!calculatedDiscountPercentage && originalPrice && displayPrice < originalPrice) {
    calculatedDiscountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group border border-gray-200">
      {/* Image Section */} 
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-56 object-cover rounded-t-lg"
        />
        {/* Bestseller/Featured Tag */} 
        {is_bestseller && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded">
            Bestseller
          </span>
        )}
        {/* Discount Badge */} 
        {calculatedDiscountPercentage && calculatedDiscountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            {calculatedDiscountPercentage}% OFF
          </span>
        )}
         {/* Overlay for hover effect or additional info - can be used later */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
      </div>

      {/* Background Image */} {/* This seems like a duplicate comment, removing. The img tag is above. */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-xs text-gray-500 mb-2 flex items-center">
          <Globe size={14} className="mr-1 text-gray-400" /> {location}
        </p>

        {/* Rating and Reviews */} 
        {rating && review_count && review_count > 0 ? (
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            ))}
            <span className="ml-2 text-xs text-gray-600">({review_count} reviews)</span>
          </div>
        ) : (
          <div className="h-6 mb-2"></div> // Placeholder for alignment if no rating
        )}

        {/* Highlights/Content */} 
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow min-h-[40px]">
          {content || (highlights && highlights.length > 0 ? highlights[0] : 'Discover this amazing package!')}
        </p>

        <div className="border-t pt-3 mt-auto"> {/* Pushes price and button to bottom */} 
          {/* Price Display */} 
          <div className="mb-3">
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through mr-2">₱{originalPrice.toFixed(2)}</span>
            )}
            <span className="text-xl font-bold text-primary">₱{displayPrice.toFixed(2)}</span>
            <span className="text-xs text-gray-600 ml-1">per adult</span>
          </div>

          {/* Duration */} 
          <div className="text-xs text-gray-500 mb-3 flex items-center">
            <Clock size={14} className="mr-1 text-gray-400" /> {duration}
          </div>

          {/* Book Now Button */} 
          <Link 
            to={`/packages/${id}`} 
            className="w-full block text-center bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;