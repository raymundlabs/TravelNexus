import { useQuery } from '@tanstack/react-query';
import { type Testimonial } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  if (error) {
    console.error('Error fetching testimonials:', error);
  }

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">What Our Travelers Say</h2>
          <p className="max-w-2xl mx-auto text-white/80">
            Read reviews from our satisfied customers who have explored the world with us
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <Skeleton className="h-4 w-24 mb-4 bg-white/20" />
                <Skeleton className="h-20 w-full mb-6 bg-white/20" />
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-4 bg-white/20" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1 bg-white/20" />
                    <Skeleton className="h-4 w-32 bg-white/20" />
                  </div>
                </div>
              </div>
            ))
          ) : testimonials && testimonials.length > 0 ? (
            // Testimonials data
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                  {testimonial.rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
                </div>
                <p className="italic mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.authorImage || "https://via.placeholder.com/48"} 
                    alt={testimonial.authorName} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">{testimonial.authorName}</p>
                    <p className="text-white/70 text-sm">{testimonial.productName}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No data state
            <div className="col-span-3 text-center py-8">
              <p className="text-white/80">No testimonials available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
