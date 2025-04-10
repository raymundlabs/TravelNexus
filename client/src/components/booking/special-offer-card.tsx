import { Button } from '@/components/ui/button';
import { type SpecialOffer } from '@shared/schema';
import { formatPrice } from '@/lib/utils';

interface SpecialOfferCardProps {
  offer: SpecialOffer;
}

export default function SpecialOfferCard({ offer }: SpecialOfferCardProps) {
  const { 
    title, 
    description, 
    imageUrl, 
    originalPrice, 
    discountedPrice, 
    badge,
    priceUnit
  } = offer;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {badge && (
          <div className={`absolute top-4 left-4 ${
            badge.includes('OFF') ? 'bg-amber-400 text-neutral-800' : 'bg-rose-500 text-white'
          } px-3 py-1 rounded-full font-bold text-sm`}>
            {badge}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
        <p className="text-neutral-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-neutral-500 line-through">{formatPrice(originalPrice)}</span>
            <span className="text-primary font-bold text-xl ml-2">{formatPrice(discountedPrice)}</span>
            <span className="text-sm text-neutral-500">/ {priceUnit}</span>
          </div>
          <Button>
            View Deal
          </Button>
        </div>
      </div>
    </div>
  );
}
