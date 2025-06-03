import React, { useEffect, useState } from 'react';
import { Star, Clock, Users, MapPin, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet';
import { SITE_NAME } from '@/lib/constants';
import { Package as PackageType } from './homepage2'; // Re-using the interface from homepage2.tsx
import Testimonials from '@/components/sections/testimonials'; // Import Testimonials component
import PackageCard from '@/components/PackageCard'; // Import PackageCard for suggested packages

// You might want to refine the PackageType here if details page needs more or different fields
// For now, we assume PackageType from homepage2.tsx is sufficient or a good base.

const PackageDetailPage: React.FC = () => {
  const params = useParams();
  const packageId = params.id;
  const [, setLocation] = useLocation();
  const [pkg, setPackage] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [suggestedPackages, setSuggestedPackages] = useState<PackageType[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState(7200); // Initial time: 2 hours in seconds

  useEffect(() => {
    if (!packageId) return;

    const fetchPackageDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('packages')
          .select('*')
          .eq('id', packageId)
          .single();

        if (supabaseError) throw supabaseError;
        setPackage(data);
      } catch (err: any) {
        console.error('Error fetching package details:', err);
        setError(err.message || 'Failed to fetch package details.');
      }
      setLoading(false);
    };

    fetchPackageDetails();
  }, [packageId]);

  useEffect(() => {
    if (pkg) {
      let images: string[] = [];
      if (pkg.fetured_image && typeof pkg.fetured_image === 'string' && pkg.fetured_image.trim() !== '') {
        images.push(pkg.fetured_image);
      }
      // image_urls is now string[] as per PackageType
      if (pkg.image_urls && Array.isArray(pkg.image_urls)) {
        const uniqueImageUrls = pkg.image_urls.filter(
          url => typeof url === 'string' && url.trim() !== '' && !images.includes(url) // ensure each url is a valid string
        );
        images = [...images, ...uniqueImageUrls];
      }

      if (images.length === 0) {
        images.push('/images/placeholder-package.jpg'); // Ensure this placeholder exists in /public/images
      }
      setAllImages(images);
      setCurrentImageIndex(0); // Start with the first image
    }
  }, [pkg]);

  // Countdown Timer Logic (Simulated)
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (pkg && pkg.id && pkg.destination_id) {
      const fetchSuggestedPackages = async () => {
        setSuggestedLoading(true);
        try {
          const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('destination_id', pkg.destination_id)
            .neq('id', pkg.id) // Exclude the current package
            .limit(3); // Show up to 3 suggestions

          if (error) throw error;
          setSuggestedPackages(data || []);
        } catch (err: any) {
          console.error('Error fetching suggested packages:', err);
          // Optionally set an error state for suggested packages
        }
        setSuggestedLoading(false);
      };
      fetchSuggestedPackages();
    }
  }, [pkg]);

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!allImages.length) return;
    setCurrentImageIndex(prevIndex => {
      let newIndex = direction === 'next' ? prevIndex + 1 : prevIndex - 1;
      if (newIndex < 0) newIndex = allImages.length - 1;
      if (newIndex >= allImages.length) newIndex = 0;
      return newIndex;
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading package details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!pkg || allImages.length === 0) {
    return <div className="container mx-auto px-4 py-8 text-center">Package not found or no images available.</div>;
  }

  const currentImage = allImages[currentImageIndex];

  const displayPrice = pkg.discounted_price && pkg.discounted_price < pkg.price ? pkg.discounted_price : pkg.price;
  const originalPrice = pkg.discounted_price && pkg.discounted_price < pkg.price ? pkg.price : null;
  let calculatedDiscountPercentage = pkg.discount_percentage;
  if (!calculatedDiscountPercentage && originalPrice && displayPrice < originalPrice) {
    calculatedDiscountPercentage = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
  }

  return (
    <>
      <Helmet>
        <title>{`${pkg.name} | Package Details | ${SITE_NAME}`}</title>
        <meta name="description" content={pkg.description || `Explore details for ${pkg.name}.`} />
      </Helmet>
      <main className="bg-gray-50 py-8 font-sans">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs - Can be made dynamic later */}
          <div className="mb-4 text-sm text-gray-600">
            <a href="/" className="hover:text-primary">Home</a> &gt; 
            <a href="/packages" className="hover:text-primary"> Packages</a> &gt; 
            <span>{pkg.name}</span>
          </div>

          {/* Package Name & Rating (Above Gallery & Booking Box) */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{pkg.name}</h1>
            <div className="flex items-center">
              {pkg.rating && pkg.review_count && pkg.review_count > 0 ? (
                <>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className={`mr-0.5 ${i < Math.round(pkg.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{pkg.rating.toFixed(1)} ({pkg.review_count} reviews)</span>
                </>
              ) : (
                <span className="text-sm text-gray-500">No reviews yet</span>
              )}
              {/* Placeholder for location if available in pkg object */}
              {/* <MapPin size={16} className="ml-4 mr-1 text-gray-500" /> <span className="text-sm text-gray-600">{pkg.location || 'Amazing Destination'}</span> */}
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-10 lg:gap-8">
            {/* Left Column: Image Gallery & Main Details */}
            <div className="lg:col-span-7">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                <div className="relative">
                  <img src={currentImage} alt={pkg.name} className="w-full h-[300px] md:h-[450px] object-cover" />
                  {allImages.length > 1 && (
                    <>
                      <button 
                        onClick={() => handleImageNavigation('prev')} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors">
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={() => handleImageNavigation('next')} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors">
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="p-2 sm:p-4 flex space-x-2 overflow-x-auto bg-gray-100 border-t">
                    {allImages.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={imgUrl}
                        alt={`${pkg.name} thumbnail ${index + 1}`}
                        className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer border-2 hover:border-primary transition-all ${currentImageIndex === index ? 'border-primary scale-105' : 'border-transparent'}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Package Overview/Description */}
              <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Package Overview</h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {pkg.description || 'No description available.'}
                </div>
              </div>

              {/* Inclusions & Highlights */}
              <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <CheckCircle size={22} className="mr-2 text-green-500" /> What's Included
                    </h3>
                    {pkg.inclusions && pkg.inclusions.length > 0 ? (
                      <ul className="space-y-3.5">
                        {pkg.inclusions.map((item, index) => (
                          <li key={`inc-${index}`} className="flex items-start">
                            <CheckCircle size={20} className="mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 text-base leading-relaxed whitespace-pre-line">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-gray-500">Details not specified.</p>}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Star size={22} className="mr-2 text-yellow-500" /> Package Highlights
                    </h3>
                    {pkg.highlights && pkg.highlights.length > 0 ? (
                      <ul className="space-y-3.5">
                        {pkg.highlights.map((item, index) => (
                          <li key={`hl-${index}`} className="flex items-start">
                            <Star size={20} className="mr-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700 text-base leading-relaxed whitespace-pre-line">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-gray-500">Details not specified.</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Box */}
            <div className="lg:col-span-3 mt-8 lg:mt-0">
              <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
                <div className="mb-4 pb-4 border-b">
                  {originalPrice && (
                    <span className="text-lg text-gray-500 line-through mr-2">₱{originalPrice.toFixed(2)}</span>
                  )}
                  <span className="text-3xl font-bold text-primary">₱{displayPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-600 ml-1">/ person</span>
                  {calculatedDiscountPercentage && calculatedDiscountPercentage > 0 && (
                    <div className="mt-1">
                      <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded">
                        SAVE {calculatedDiscountPercentage}%
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Urgency/Scarcity Elements - Driven by pkg data ideally */}
                {/* Example: if (pkg.last_minute_deal) */}
                <div className="my-3 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                  <p className="font-bold">⚡ Last Minute Deal!</p>
                  <p className="text-sm">Book now to get the best price.</p>
                </div>

                {/* Example: if (pkg.spots_left && pkg.spots_left < 5) */}
                <div className="my-3 text-sm text-red-600 font-semibold">
                  <p>🔥 Only 3 spots left at this price!</p>
                </div>
                
                {/* Example: if (pkg.selling_fast) */}
                <div className="my-3">
                    <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full animate-pulse">Popular! Selling Fast</span>
                </div>

                {/* Secure Your Spot Section */}
                <div className="my-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg text-center shadow-md">
                  <h3 className="text-lg font-bold text-green-700 mb-2">Secure Your Spot For Only 20% Down!</h3>
                  <p className="text-sm text-gray-600 mb-1">Limited time offer. Don't miss out!</p>
                  {timeLeft > 0 && (
                    <div className="my-2">
                      <span className="text-2xl font-mono font-bold text-red-600 bg-white px-2 py-1 rounded shadow tabular-nums">
                        {formatTime(timeLeft)}
                      </span>
                      <p className="text-xs text-red-500 mt-1">Offer Ends Soon</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-3 mb-2">We accept:</p>
                  <div className="flex justify-center items-center space-x-2 sm:space-x-3 flex-wrap">
                    <img src="/images/payment/gcash.png" alt="GCash" title="GCash" className="h-6 my-1" />
                    <img src="/images/payment/paymaya.png" alt="PayMaya" title="PayMaya" className="h-6 my-1" />
                    <img src="/images/payment/visa.png" alt="Visa" title="Visa" className="h-8 my-1" />
                    <img src="/images/payment/mastercard.png" alt="Mastercard" title="Mastercard" className="h-8 my-1" />
                    <img src="/images/payment/bank transfer.png" alt="Bank Transfer" title="Bank Transfer" className="h-7 my-1" />
                  </div>
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t mt-4">
                  <div className="flex items-center text-gray-700">
                    <Clock size={18} className="mr-2 text-primary" /> 
                    <strong>Duration:</strong><span className="ml-1">{pkg.duration}</span>
                  </div>
                  {pkg.num_pax && (
                    <div className="flex items-center text-gray-700">
                      <Users size={18} className="mr-2 text-primary" /> 
                      <strong>Group Size:</strong><span className="ml-1">{pkg.num_pax}</span>
                    </div>
                  )}
                  {/* Add more key details here if needed */}
                </div>

                {/* Placeholder for date picker & guest selection */}
                <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                  Booking options (date, guests) will be available here soon.
                </div>

                <button 
                  onClick={() => packageId ? setLocation(`/booking/${packageId}`) : alert('Package ID not available')} 
                  className="w-full px-6 py-3 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-primary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  disabled={!packageId}
                >
                  Book Now
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">Secure your spot today!</p>
              </div>
            </div>
          </div>
          
          {/* Suggested Packages Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">You Might Also Like</h2>
            {suggestedLoading ? (
              <p className="text-center text-gray-500">Loading suggestions...</p>
            ) : suggestedPackages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedPackages.map((suggPkg) => (
                  <PackageCard
                    key={suggPkg.id}
                    packageData={{
                      ...suggPkg,
                      price: suggPkg.price.toFixed(2),
                      imageUrl: suggPkg.fetured_image || (suggPkg.image_urls && suggPkg.image_urls.length > 0 ? suggPkg.image_urls[0] : '/images/placeholder-package.jpg'),
                      location: suggPkg.name, // Or a specific location field if available
                      content: suggPkg.description,
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md">
                No similar packages found at the moment.
              </p>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-16">
            {/* The Testimonials component likely has its own title, or you can add one here if needed */}
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Guest Reviews</h2> */}
            <Testimonials />
          </div>

        </div>
      </main>
    </>
  );
};

export default PackageDetailPage;
