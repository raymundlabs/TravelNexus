import { Button } from '@/components/ui/button';
import { type Package } from '@shared/schema';
import { formatPrice } from '@/lib/utils';

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const { 
    id,
    name, 
    description, 
    imageUrl, 
    price, 
    discountedPrice, 
    rating, 
    reviewCount, 
    highlights,
    isBestseller,
    discountPercentage
  } = pkg;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-2/5 relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        {(isBestseller || discountPercentage) && (
          <div className={`absolute top-4 left-4 ${
            isBestseller ? 'bg-rose-500 text-white' : 'bg-amber-400 text-neutral-800'
          } px-3 py-1 rounded-full font-bold text-sm`}>
            {isBestseller ? 'BESTSELLER' : `${discountPercentage}% OFF`}
          </div>
        )}
      </div>
      <div className="md:w-3/5 p-6">
        <h3 className="font-heading text-2xl font-bold mb-2">{name}</h3>
        <div className="flex items-center mb-3">
          <div className="flex text-amber-400 text-sm mr-2">
            {[...Array(Math.floor(rating))].map((_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
            {rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
          </div>
          <span className="text-neutral-500 text-sm">({reviewCount} reviews)</span>
        </div>
        <p className="text-neutral-600 mb-4">{description}</p>
        
        {highlights && highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {highlights.map((highlight, index) => (
              <span key={index} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                <i className={`fas fa-${getIconForHighlight(highlight)} mr-1`}></i> {highlight}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            {discountedPrice && discountedPrice < price && (
              <span className="text-neutral-500 line-through">{formatPrice(price)}</span>
            )}
            <span className="font-bold text-primary text-2xl ml-2">
              {formatPrice(discountedPrice || price)}
            </span>
            <span className="text-neutral-500 text-sm">/ person</span>
          </div>
          <Button asChild>
            <a href={`/packages/${id}`}>View Package</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to choose appropriate icon for highlight
function getIconForHighlight(highlight: string): string {
  const lowercaseHighlight = highlight.toLowerCase();
  
  if (lowercaseHighlight.includes('hotel') || lowercaseHighlight.includes('resort') || lowercaseHighlight.includes('accommodation')) {
    return 'hotel';
  } else if (lowercaseHighlight.includes('tour') || lowercaseHighlight.includes('guide')) {
    return 'map-marked-alt';
  } else if (lowercaseHighlight.includes('meal') || lowercaseHighlight.includes('food') || lowercaseHighlight.includes('inclusive')) {
    return 'utensils';
  } else if (lowercaseHighlight.includes('train') || lowercaseHighlight.includes('rail')) {
    return 'train';
  } else if (lowercaseHighlight.includes('ship') || lowercaseHighlight.includes('cruise')) {
    return 'ship';
  }
  
  return 'check-circle';
}
