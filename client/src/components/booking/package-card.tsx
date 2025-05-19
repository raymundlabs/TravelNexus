import { useLocation } from 'wouter';
import { type Package } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const [, setLocation] = useLocation();

  const handleBookNow = () => {
    setLocation(`/packages/${pkg.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={pkg.imageUrl || '/placeholder-image.jpg'} 
          alt={pkg.name} 
          className="w-full h-48 object-cover"
        />
        {pkg.discountedPrice && pkg.price && (
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
            Save {Math.round((1 - pkg.discountedPrice / pkg.price) * 100)}%
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-heading text-xl font-bold mb-2">{pkg.name}</h3>
        <div className="flex items-center mb-2">
          {pkg.rating && (
            <div className="flex text-amber-400 mr-2">
              {[...Array(Math.floor(pkg.rating))].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          )}
          <span className="text-sm text-neutral-600">
            {pkg.rating?.toFixed(1)} ({pkg.reviewCount || 0} reviews)
          </span>
        </div>
        <p className="text-neutral-600 mb-4 line-clamp-2">{pkg.description}</p>
        
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {pkg.highlights.map((highlight: string, index: number) => (
              <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
                {highlight}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            {pkg.discountedPrice && pkg.price ? (
              <div>
                <span className="text-neutral-500 line-through mr-2">${pkg.price}</span>
                <span className="text-xl font-bold text-primary">${pkg.discountedPrice}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-primary">${pkg.price || 0}</span>
            )}
            <span className="text-sm text-neutral-500"> / person</span>
          </div>
          <Button onClick={handleBookNow}>Book Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}
