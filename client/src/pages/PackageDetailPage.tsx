import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet';
import { SITE_NAME } from '@/lib/constants';
import { Package as PackageType } from './homepage2'; // Re-using the interface from homepage2.tsx

// You might want to refine the PackageType here if details page needs more or different fields
// For now, we assume PackageType from homepage2.tsx is sufficient or a good base.

const PackageDetailPage: React.FC = () => {
  const params = useParams();
  const packageId = params.id;
  const [pkg, setPackage] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          .single(); // Expecting a single package

        if (supabaseError) {
          throw supabaseError;
        }
        setPackage(data);
      } catch (err: any) {
        console.error('Error fetching package details:', err);
        setError(err.message || 'Failed to fetch package details.');
      }
      setLoading(false);
    };

    fetchPackageDetails();
  }, [packageId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading package details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!pkg) {
    return <div className="container mx-auto px-4 py-8 text-center">Package not found.</div>;
  }

  // Determine image to display: fetured_image first, then image_urls
  // Assuming image_urls is a single URL string as per the latest schema provided.
  // If image_urls were an array, you'd pick the first or handle a gallery.
  const displayImageUrl = pkg.fetured_image || pkg.image_urls;

  return (
    <>
      <Helmet>
        <title>{`${pkg.name} | Package Details | ${SITE_NAME}`}</title>
        <meta name="description" content={pkg.description} />
      </Helmet>
      <main className="container mx-auto px-4 py-8">
        <article className="bg-white shadow-xl rounded-lg overflow-hidden">
          {displayImageUrl && (
            <img src={displayImageUrl} alt={pkg.name} className="w-full h-96 object-cover" />
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{pkg.name}</h1>
            
            <div className="mb-6 text-gray-600">
                <p className="text-lg">{pkg.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Package Details</h2>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li><strong>Duration:</strong> {pkg.duration}</li>
                        <li><strong>Price:</strong> ₱{pkg.price.toFixed(2)}{pkg.discounted_price && pkg.discounted_price < pkg.price ? <span className='ml-2 line-through text-sm text-gray-500'>₱{pkg.discounted_price.toFixed(2)}</span> : ''} per adult</li>
                        {pkg.num_pax && <li><strong>Pax:</strong> {pkg.num_pax}</li>}
                        {pkg.rating && <li><strong>Rating:</strong> {pkg.rating}/5 ({pkg.review_count} reviews)</li>}
                    </ul>
                </div>
                <div>
                    {pkg.highlights && pkg.highlights.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">Highlights:</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {pkg.highlights.map((highlight: string, index: number) => (
                                <li key={index}>{highlight}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {pkg.inclusions && pkg.inclusions.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">Inclusions:</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {pkg.inclusions.map((inclusion: string, index: number) => (
                                <li key={index}>{inclusion}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => alert('Proceed to booking steps (to be implemented)')} 
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
        </article>
      </main>
    </>
  );
};

export default PackageDetailPage;
