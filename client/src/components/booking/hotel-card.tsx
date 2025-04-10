import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import { type Hotel } from '@shared/schema';
import { formatPrice } from '@/lib/utils';

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const { id, name, address, imageUrl, price, rating } = hotel;

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative overflow-hidden h-48">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-neutral-600" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex text-amber-400 mb-2">
          {[...Array(Math.floor(rating))].map((_, i) => (
            <i key={i} className="fas fa-star"></i>
          ))}
          {rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
        </div>
        <h3 className="font-heading font-bold">{name}</h3>
        <p className="text-neutral-500 text-sm mb-2">
          <i className="fas fa-map-marker-alt mr-1"></i> {address}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="font-bold text-primary">{formatPrice(price)}</span>
            <span className="text-neutral-500 text-sm">/ night</span>
          </div>
          <Link href={`/hotels/${id}`} className="text-primary hover:text-primary-dark font-medium text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
