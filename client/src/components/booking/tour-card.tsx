import { Link } from 'wouter';
import { type Tour } from '@shared/schema';
import { formatPrice } from '@/lib/utils';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const { id, name, description, imageUrl, duration, price, groupSize, rating, reviewCount } = tour;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group">
      <div className="relative overflow-hidden h-56">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <div className="flex items-center text-sm mb-1">
            <i className="far fa-clock mr-1"></i> {duration}
            {groupSize && (
              <>
                <span className="mx-2">•</span>
                <i className="fas fa-users mr-1"></i> {groupSize}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-bold mb-2">{name}</h3>
        <p className="text-neutral-600 text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-primary text-lg">{formatPrice(price)}</span>
            <span className="text-neutral-500 text-sm">/ person</span>
          </div>
          <div className="flex items-center">
            <div className="flex text-amber-400 text-sm mr-1">
              {[...Array(Math.floor(rating))].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
              {rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
            </div>
            <span className="text-neutral-500 text-sm">({reviewCount})</span>
          </div>
        </div>
        <div className="mt-4">
          <Link 
            href={`/tours/${id}`} 
            className="block w-full text-center text-primary border border-primary py-2 rounded hover:bg-primary hover:text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
