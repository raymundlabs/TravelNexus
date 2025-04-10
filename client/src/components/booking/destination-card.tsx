import { Link } from 'wouter';
import { type Destination } from '@shared/schema';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { id, name, country, imageUrl, rating, reviewCount } = destination;

  return (
    <Link href={`/destinations/${id}`}>
      <div className="destination-card group cursor-pointer">
        <div className="relative overflow-hidden rounded-xl shadow-md h-72">
          <img 
            src={imageUrl}
            alt={`${name}, ${country}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="font-heading text-2xl font-bold">{name}, {country}</h3>
            <div className="flex items-center mt-2">
              <div className="flex text-amber-400">
                {[...Array(Math.floor(rating))].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
                {rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
              </div>
              <span className="ml-2">{rating.toFixed(1)} ({reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
