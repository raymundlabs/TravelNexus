import React from 'react';
import { Globe, Clock, Sunrise } from 'lucide-react';

interface PackageCardProps {
  packageData: {
    id: number;
    name: string;
    location: string;
    imageUrl: string;
    duration: string;
    price: string;
    content?: string; // Added content field based on homepage2.tsx data
    // Add other relevant package details here based on your data
  };
  index: number; // To display the index number like in the image
}

const PackageCard: React.FC<PackageCardProps> = ({ packageData, index }) => {
  // Placeholder icons/info to match the image layout
  // We can map real package data to these placeholders
  const dummyMetric1 = `${Math.floor(Math.random() * 30) + 10}°`; // e.g., Temperature
  const dummyMetric2 = `${Math.floor(Math.random() * 50) + 10} Mbps`; // e.g., Internet speed

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full">
      {/* Background Image */}
      <img
        src={packageData.imageUrl}
        alt={packageData.name}
        className="w-full h-72 object-cover object-center flex-shrink-0"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Layered Info */}
      <div className="absolute top-0 left-0 right-0 p-4 text-white z-10">
        {/* Top left index */}
        <div className="absolute top-4 left-4 text-white text-lg font-bold">
          {index + 1}
        </div>

        {/* Top right metrics (replace with relevant package info) */}
        <div className="absolute top-4 right-4 text-white flex items-center space-x-2">
           {/* Example: Duration */}
           <div className="flex items-center bg-black/30 rounded-full px-2 py-1 text-xs">
             <Clock className="h-3 w-3 mr-1" />
             <span>{packageData.duration}</span>
           </div>
           {/* Example: A generic icon */}
            <div className="flex items-center bg-black/30 rounded-full px-2 py-1 text-xs">
              <Globe className="h-3 w-3 mr-1" />
              <span>{packageData.location}</span>
            </div>
        </div>
      </div>
      
      {/* Card Body - Below Image */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Main package title and location */}
        <div className="mb-2 flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{packageData.name}</h3>
          <p className="text-sm text-gray-600">{packageData.location}</p>
          {packageData.content && <p className="text-sm text-gray-700 mt-2 italic">{packageData.content}</p>}
        </div>

        {/* Bottom info (Price and Button) */}
        <div className="flex items-center justify-between mt-4">
          {/* Price */}
          <div className="flex items-center">
            <span className="text-lg font-bold text-primary">₱{packageData.price}</span>
             <span className="text-sm text-gray-600 ml-1">per adult</span>
          </div>
          {/* Book Now Button */}
          <a 
            href={`/book/${packageData.id}`} // Example link, replace with actual booking page path
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Book Now
          </a>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default PackageCard; 