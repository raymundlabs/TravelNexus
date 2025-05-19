import { useQuery } from '@tanstack/react-query';
import { type Testimonial } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Facebook, Star, Volume2, VolumeX, Image, Plus, MoreHorizontal, ThumbsUp, Calendar, Users, Award } from 'lucide-react';

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktopView, setIsDesktopView] = useState(false);
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [helpful, setHelpful] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if desktop view on mount and on resize
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktopView(window.innerWidth >= 1024);
    };
    
    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    
    return () => {
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, []);

  // Auto-play next video every 20 seconds in mobile view
  useEffect(() => {
    if (isDesktopView) return;
    
    const interval = setInterval(() => {
      if (activeIndex < testimonialItems.length - 1) {
        handleVideoChange(activeIndex + 1);
      } else {
        handleVideoChange(0);
      }
    }, 20000);
    
    return () => clearInterval(interval);
  }, [activeIndex, isDesktopView]);

  // Convert rating to TripAdvisor style rating text
  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    return 'Poor';
  };

  // Get rating bubble color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-[#00aa6c]'; // TripAdvisor green
    if (rating >= 4.0) return 'bg-[#5cb85c]';
    if (rating >= 3.5) return 'bg-[#f0ad4e]';
    if (rating >= 3.0) return 'bg-[#d9534f]';
    return 'bg-[#d43f3a]';
  };

  // Sample testimonial items (replace with actual data from backend)
  const testimonialItems = [
    {
      id: 1,
      type: 'image',
      content: "Beautiful girls at Whitebeach Puerto Galera.",
      authorName: "Arianelyn",
      authorUsername: "@arianelyn_travels",
      authorImage: "/attached_assets/Arianelyn.PNG",
      mediaUrl: "/attached_assets/Arianelyn.PNG",
      rating: 5.0,
      productName: "Puerto Galera White Beach",
      likes: 1550,
      comments: 98,
      shares: 52,
      tripDate: "May 2024",
      tripType: "Friends",
      helpfulVotes: 47,
      verified: true
    },
    {
      id: 2,
      type: 'image',
      content: "Thankyou maam Cynthia and Family for Availing our Tour Packages.",
      authorName: "Cyntia",
      authorUsername: "@cyntia_family",
      authorImage: "/attached_assets/Cyntia.PNG",
      mediaUrl: "/attached_assets/Cyntia.PNG",
      rating: 4.9,
      productName: "Puerto Galera Tour Packages",
      likes: 2150,
      comments: 112,
      shares: 63,
      tripDate: "April 2024",
      tripType: "Family",
      helpfulVotes: 60,
      verified: true
    },
    {
      id: 3,
      type: 'image',
      content: "Thankyou for always Trusting Matt Destinations Travel and Tours. Till next Vacation po maam.",
      authorName: "Dolor",
      authorUsername: "@dolor_adventures",
      authorImage: "/attached_assets/Dolor.PNG",
      mediaUrl: "/attached_assets/Dolor.PNG",
      rating: 4.7,
      productName: "Snorkeling & Island Hopping",
      likes: 1850,
      comments: 83,
      shares: 48,
      tripDate: "April 2024",
      tripType: "Friends",
      helpfulVotes: 43,
      verified: true
    },
    {
      id: 4,
      type: 'image',
      content: "Thankyou so much Sir Elmer. Family is Love.",
      authorName: "Elmer",
      authorUsername: "@elmer_familytrips",
      authorImage: "/attached_assets/Elmer.PNG",
      mediaUrl: "/attached_assets/Elmer.PNG",
      rating: 4.8,
      productName: "Puerto Galera Experience",
      likes: 2050,
      comments: 88,
      shares: 58,
      tripDate: "May 2024",
      tripType: "Family",
      helpfulVotes: 53,
      verified: true
    },
    {
      id: 5,
      type: 'image',
      content: "Thank you for choosing Matt Destinations Travel and Tours Maam Florena and Sir for your recent experience!",
      authorName: "Florena",
      authorUsername: "@florena_travels",
      authorImage: "/attached_assets/Florena.PNG",
      mediaUrl: "/attached_assets/Florena.PNG",
      rating: 5.0,
      productName: "Snorkeling & Coral Garden",
      likes: 2450,
      comments: 97,
      shares: 61,
      tripDate: "April 2024",
      tripType: "Couples",
      helpfulVotes: 65,
      verified: true
    },
    {
      id: 6,
      type: 'image',
      content: "Everyone needs a friend that calls and say, 'GET Dressed, we're Going on an Adventure'.",
      authorName: "Gen",
      authorUsername: "@gen_adventures",
      authorImage: "/attached_assets/Gen.PNG",
      mediaUrl: "/attached_assets/Gen.PNG",
      rating: 4.9,
      productName: "Matt Destinations Tours",
      likes: 2350,
      comments: 103,
      shares: 68,
      tripDate: "March 2024",
      tripType: "Friends",
      helpfulVotes: 62,
      verified: true
    },
    {
      id: 7,
      type: 'image',
      content: "Friends, Sun, Sand and Sea, That Sounds Like A Summer to me.... Thankyou so much maam Gina and Friends.",
      authorName: "Gina",
      authorUsername: "@gina_summer",
      authorImage: "/attached_assets/Gina.PNG",
      mediaUrl: "/attached_assets/Gina.PNG",
      rating: 4.7,
      productName: "Island Hopping Tour",
      likes: 1850,
      comments: 73,
      shares: 43,
      tripDate: "March 2024",
      tripType: "Friends",
      helpfulVotes: 48,
      verified: true
    },
    {
      id: 8,
      type: 'image',
      content: "Thankyou so much maam Helina and Friends. We hope your trip was fun, relaxing, and memorable.",
      authorName: "Helina",
      authorUsername: "@helina_relax",
      authorImage: "/attached_assets/Helina.PNG",
      mediaUrl: "/attached_assets/Helina.PNG",
      rating: 4.8,
      productName: "Puerto Galera Getaway",
      likes: 1950,
      comments: 85,
      shares: 50,
      tripDate: "April 2024",
      tripType: "Friends",
      helpfulVotes: 50,
      verified: true
    },
    {
      id: 9,
      type: 'image',
      content: "Thank You So Much! Maam Jovelyn. We are truly grateful to everyone who continues to trust and book our Puerto Galera Tour Packages!",
      authorName: "Jovelyn",
      authorUsername: "@jovelyn_booked",
      authorImage: "/attached_assets/Jovelyn.PNG",
      mediaUrl: "/attached_assets/Jovelyn.PNG",
      rating: 4.9,
      productName: "Puerto Galera Tour Packages",
      likes: 2250,
      comments: 93,
      shares: 58,
      tripDate: "April 2024",
      tripType: "Solo",
      helpfulVotes: 55,
      verified: true
    },
    {
      id: 10,
      type: 'image',
      content: "Thankyou so Much maam Juvy mae for availing Our Tours.",
      authorName: "Juvy",
      authorUsername: "@juvy_beachlover",
      authorImage: "/attached_assets/Juvy.PNG",
      mediaUrl: "/attached_assets/Juvy.PNG",
      rating: 4.7,
      productName: "Snorkeling Activities",
      likes: 1850,
      comments: 73,
      shares: 43,
      tripDate: "April 2024",
      tripType: "Family",
      helpfulVotes: 48,
      verified: true
    },
    {
      id: 11,
      type: 'image',
      content: "Summer na sa Puerto Galera! Vacation Together with Friends. Thankyou so much maam Lhea and Friends.",
      authorName: "Lhea",
      authorUsername: "@lhea_summer",
      authorImage: "/attached_assets/Lhea.PNG",
      mediaUrl: "/attached_assets/Lhea.PNG",
      rating: 4.8,
      productName: "Puerto Galera Vacation",
      likes: 2050,
      comments: 88,
      shares: 53,
      tripDate: "March 2024",
      tripType: "Friends",
      helpfulVotes: 53,
      verified: true
    },
    {
      id: 12,
      type: 'image',
      content: "Let's skip Fancy dates and watch Countless Sunset. Thankyou so much maam Mharie for choosing us.",
      authorName: "Mharie",
      authorUsername: "@mharie_sunset",
      authorImage: "/attached_assets/Mharie.PNG",
      mediaUrl: "/attached_assets/Mharie.PNG",
      rating: 4.9,
      productName: "Sunset View Tour",
      likes: 2350,
      comments: 103,
      shares: 68,
      tripDate: "March 2024",
      tripType: "Couples",
      helpfulVotes: 62,
      verified: true
    },
    {
      id: 13,
      type: 'image',
      content: "Relaxing by the tranquil shore of White Beach.",
      authorName: "Pic 1",
      authorUsername: "@pic1_adventures",
      authorImage: "/attached_assets/Pic 1.PNG",
      mediaUrl: "/attached_assets/Pic 1.PNG",
      rating: 4.7,
      productName: "Puerto Galera White Beach",
      likes: 1700,
      comments: 60,
      shares: 35,
      tripDate: "September 2025",
      tripType: "Friends",
      helpfulVotes: 39,
      verified: true
    },
    {
      id: 14,
      type: 'image',
      content: "Thankyou so much Sir Jc Mercado and Friends, For availing our Tour Packages.",
      authorName: "Sir Jc",
      authorUsername: "@sirjc_tours",
      authorImage: "/attached_assets/Sir Jc.PNG",
      mediaUrl: "/attached_assets/Sir Jc.PNG",
      rating: 4.8,
      productName: "Island Hopping Tour (Big Boat)",
      likes: 1950,
      comments: 85,
      shares: 50,
      tripDate: "March 2024",
      tripType: "Friends",
      helpfulVotes: 50,
      verified: true
    },
    {
      id: 15,
      type: 'image',
      content: "Beautiful sandbar experience near White Beach.",
      authorName: "Arianelyn",
      authorUsername: "@arianelyn_travels",
      authorImage: "/attached_assets/Arianelyn.PNG",
      mediaUrl: "/attached_assets/Arianelyn.PNG",
      rating: 4.7,
      productName: "Puerto Galera White Beach",
      likes: 1800,
      comments: 70,
      shares: 40,
      tripDate: "February 2026",
      tripType: "Family",
      helpfulVotes: 45,
      verified: true
    },
    {
      id: 16,
      type: 'image',
      content: "Great waves for beginners at White Beach.",
      authorName: "Cyntia",
      authorUsername: "@cyntia_family",
      authorImage: "/attached_assets/Cyntia.PNG",
      mediaUrl: "/attached_assets/Cyntia.PNG",
      rating: 4.7,
      productName: "Puerto Galera White Beach",
      likes: 1700,
      comments: 60,
      shares: 35,
      tripDate: "July 2025",
      tripType: "Couples",
      helpfulVotes: 40,
      verified: true
    },
    {
      id: 17,
      type: 'image',
      content: "Explored nearby areas from White Beach.",
      authorName: "Dolor",
      authorUsername: "@dolor_adventures",
      authorImage: "/attached_assets/Dolor.PNG",
      mediaUrl: "/attached_assets/Dolor.PNG",
      rating: 4.8,
      productName: "Puerto Galera White Beach",
      likes: 1900,
      comments: 75,
      shares: 44,
      tripDate: "August 2025",
      tripType: "Solo",
      helpfulVotes: 48,
      verified: true
    },
    {
      id: 18,
      type: 'image',
      content: "Relaxing by the tranquil shore of White Beach.",
      authorName: "Elmer",
      authorUsername: "@elmer_familytrips",
      authorImage: "/attached_assets/Elmer.PNG",
      mediaUrl: "/attached_assets/Elmer.PNG",
      rating: 4.7,
      productName: "Puerto Galera White Beach",
      likes: 1700,
      comments: 60,
      shares: 35,
      tripDate: "September 2025",
      tripType: "Friends",
      helpfulVotes: 39,
      verified: true
    },
    {
      id: 19,
      type: 'image',
      content: "Surfing at White Beach was a highlight!",
      authorName: "Florena",
      authorUsername: "@florena_travels",
      authorImage: "/attached_assets/Florena.PNG",
      mediaUrl: "/attached_assets/Florena.PNG",
      rating: 4.9,
      productName: "Puerto Galera White Beach",
      likes: 2400,
      comments: 95,
      shares: 58,
      tripDate: "October 2025",
      tripType: "Solo",
      helpfulVotes: 62,
      verified: true
    },
    {
      id: 20,
      type: 'image',
      content: "Walked along the lively beach strip at White Beach.",
      authorName: "Gen",
      authorUsername: "@gen_adventures",
      authorImage: "/attached_assets/Gen.PNG",
      mediaUrl: "/attached_assets/Gen.PNG",
      rating: 4.7,
      productName: "Puerto Galera White Beach",
      likes: 1600,
      comments: 68,
      shares: 40,
      tripDate: "November 2025",
      tripType: "Friends",
      helpfulVotes: 37,
      verified: true
    },
    {
      id: 21,
      type: 'image',
      content: "Great views of the coast from the hills near White Beach.",
      authorName: "Gina",
      authorUsername: "@gina_summer",
      authorImage: "/attached_assets/Gina.PNG",
      mediaUrl: "/attached_assets/Gina.PNG",
      rating: 4.8,
      productName: "Puerto Galera White Beach",
      likes: 2000,
      comments: 80,
      shares: 50,
      tripDate: "December 2025",
      tripType: "Solo",
      helpfulVotes: 55,
      verified: true
    },
    {
      id: 22,
      type: 'image',
      content: "Diving spots near White Beach were fantastic!",
      authorName: "Helina",
      authorUsername: "@helina_relax",
      authorImage: "/attached_assets/Helina.PNG",
      mediaUrl: "/attached_assets/Helina.PNG",
      rating: 4.9,
      productName: "Puerto Galera White Beach",
      likes: 2600,
      comments: 100,
      shares: 60,
      tripDate: "January 2026",
      tripType: "Couples",
      helpfulVotes: 68,
      verified: true
    },
    {
      id: 23,
      type: 'image',
      content: "Beautiful sandbar experience near White Beach.",
      authorName: "Jovelyn",
      authorUsername: "@jovelyn_booked",
      authorImage: "/attached_assets/Jovelyn.PNG",
      mediaUrl: "/attached_assets/Jovelyn.PNG",
      rating: 4.7,
      productName: "Puerto Galera White Beach",
      likes: 1800,
      comments: 70,
      shares: 40,
      tripDate: "February 2026",
      tripType: "Family",
      helpfulVotes: 45,
      verified: true
    },
    {
      id: 24,
      type: 'image',
      content: "Enjoyed the pristine beach and clear water at White Beach.",
      authorName: "Lhea",
      authorUsername: "@lhea_summer",
      authorImage: "/attached_assets/Lhea.PNG",
      mediaUrl: "/attached_assets/Lhea.PNG",
      rating: 4.8,
      productName: "Puerto Galera White Beach",
      likes: 1900,
      comments: 75,
      shares: 48,
      tripDate: "March 2026",
      tripType: "Friends",
      helpfulVotes: 50,
      verified: true
    }
  ];

  const handleVideoChange = (index: number) => {
    // Pause all videos
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
    
    setActiveIndex(index);
    
    // Play the newly selected video if it's a video
    if (testimonialItems[index].type === 'video' && videoRefs.current[index]) {
      videoRefs.current[index]?.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach(video => {
      if (video) video.muted = !isMuted;
    });
  };

  const handleLike = (id: number) => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleHelpful = (id: number) => {
    setHelpful(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDesktopView) return;
    
    const touchStartY = e.touches[0].clientY;
    const touchThreshold = 50;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentY = e.touches[0].clientY;
      const diffY = touchStartY - touchCurrentY;
      
      if (diffY > touchThreshold && activeIndex < testimonialItems.length - 1) {
        handleVideoChange(activeIndex + 1);
        document.removeEventListener('touchmove', handleTouchMove);
      } else if (diffY < -touchThreshold && activeIndex > 0) {
        handleVideoChange(activeIndex - 1);
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (error) {
    console.error('Error fetching testimonials:', error);
  }

  // Format numbers for display (e.g., 1200 -> 1.2K)
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Desktop Reels Component with TripAdvisor styling
  const DesktopReelItem = ({ item, index }: { item: typeof testimonialItems[0], index: number }) => (
    <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group h-[350px]">
      {/* Background Image */}
      {item.mediaUrl ? (
        item.type === 'video' ? (
          <video
            ref={el => videoRefs.current[index] = el}
            src={item.mediaUrl}
            className="w-full h-full object-cover object-center absolute inset-0"
            loop
            muted
            playsInline
            autoPlay={false}
          />
        ) : (
          <img 
            src={item.mediaUrl} 
            alt={item.content} 
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        )
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0">
           <Image className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* Layered Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
        {/* Top left index */}
        <div className="absolute top-4 left-4 text-white text-lg font-bold">
          {index + 1}
        </div>
        
        {/* Top right rating (in place of internet speed) */}
        <div className="absolute top-4 right-4 text-white flex items-center space-x-2 bg-black/30 rounded-full px-2 py-1 text-xs">
           <Star className="h-3 w-3 mr-1 fill-white text-white" />
           <span>{item.rating.toFixed(1)}</span>
        </div>
        
        {/* Main Testimonial Info (Author Name and Product/Location) */}
        <div className="mb-2 mt-10">
          <h3 className="text-xl font-bold">{item.authorName}</h3>
          <p className="text-sm text-white/90 truncate">Reviewed: {item.productName}</p>
        </div>
        
        {/* Bottom Info (Review Snippet) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-white/80 italic line-clamp-2">
            "{item.content}"
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  // Render mobile view with TikTok style + TripAdvisor elements
  const renderMobileView = () => (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden h-[700px] shadow-xl"
      onTouchStart={handleTouchStart}
    >
          {isLoading ? (
            // Skeleton loading state
        <div className="w-full h-full flex items-center justify-center">
          <Skeleton className="h-full w-full absolute" />
          <div className="absolute z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      ) : testimonialItems.length > 0 ? (
        <>
          {/* Testimonial items */}
          {testimonialItems.map((item, index) => (
            <div 
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="relative w-full h-full">
                {item.type === 'video' ? (
                  <video
                    ref={el => videoRefs.current[index] = el}
                    src={item.mediaUrl}
                    className="w-full h-full object-cover object-center"
                    loop
                    muted={isMuted}
                    playsInline
                    autoPlay={index === activeIndex}
                  />
                ) : (
                  <img 
                    src={item.mediaUrl} 
                    alt={item.content} 
                    className="w-full h-full object-cover object-center"
                  />
                )}
                
                {/* Progress bar at top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
                  <div 
                    className="h-full bg-[#00aa6c]"
                    style={{ 
                      width: `${(activeIndex / (testimonialItems.length - 1)) * 100}%`,
                      transition: 'width 0.3s ease-in-out'
                    }}
                  />
                </div>
                
                {/* Top nav icons */}
                <div className="absolute top-3 left-0 right-0 flex justify-between items-center px-4 z-20">
                  <div className={`${getRatingColor(testimonialItems[activeIndex].rating)} rounded-lg px-3 py-1 text-white font-medium text-sm flex items-center gap-1.5`}>
                    <span>{getRatingText(testimonialItems[activeIndex].rating)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.type === 'video' && (
                      <button 
                        onClick={toggleMute}
                        className="bg-black/30 backdrop-blur-sm rounded-full p-2 text-white"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* TripAdvisor-style visit info */}
                <div className="absolute top-16 left-4 z-20">
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs flex items-center gap-2 mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>Visited {item.tripDate}</span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>{item.tripType}</span>
                  </div>
                </div>
                
                {/* Overlay gradient for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" />
                
                {/* Right side interaction buttons */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
                  <button 
                    onClick={() => handleLike(item.id)} 
                    className="flex flex-col items-center text-white"
                  >
                    <div className="bg-black/40 rounded-full p-2 backdrop-blur-sm mb-1">
                      <Heart className={`w-7 h-7 ${likes[item.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </div>
                    <span className="text-xs">{formatCount(item.likes)}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleHelpful(item.id)}
                    className="flex flex-col items-center text-white"
                  >
                    <div className={`rounded-full p-2 backdrop-blur-sm mb-1 ${helpful[item.id] ? 'bg-[#00aa6c]/40' : 'bg-black/40'}`}>
                      <ThumbsUp className={`w-7 h-7 ${helpful[item.id] ? 'fill-[#00aa6c] text-[#00aa6c]' : 'text-white'}`} />
                    </div>
                    <span className="text-xs">{formatCount(item.helpfulVotes)}</span>
                  </button>
                  
                  <button className="flex flex-col items-center text-white">
                    <div className="bg-black/40 rounded-full p-2 backdrop-blur-sm mb-1">
                      <MessageCircle className="w-7 h-7" />
                    </div>
                    <span className="text-xs">{formatCount(item.comments)}</span>
                  </button>
                  
                  <button className="flex flex-col items-center text-white">
                    <div className="bg-black/40 rounded-full p-2 backdrop-blur-sm mb-1">
                      <Share2 className="w-7 h-7" />
                    </div>
                    <span className="text-xs">{formatCount(item.shares)}</span>
                  </button>
                </div>
                
                {/* Bottom user info */}
                <div className="absolute bottom-0 left-0 right-16 p-4 text-white">
                  <div className="flex items-center mb-3">
                    <img 
                      src={item.authorImage}
                      alt={item.authorName}
                      className="w-10 h-10 rounded-full border-2 border-white mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm flex items-center gap-1.5">
                        {item.authorName}
                        {item.verified && (
                          <span className="bg-[#00aa6c]/80 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
                            <Award className="w-3 h-3 mr-0.5" />
                            Verified
                          </span>
                        )}
                      </p>
                      <p className="text-white/70 text-xs">{item.authorUsername}</p>
                    </div>
                  </div>
                  
                  <div className="max-w-[260px]">
                    <div className="flex mb-2">
                      {[...Array(Math.floor(item.rating))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#00aa6c] text-[#00aa6c]" />
                      ))}
                      {item.rating % 1 >= 0.5 && <Star className="w-4 h-4 fill-[#00aa6c] text-[#00aa6c]" />}
                    </div>
                    <p className="text-sm font-medium mb-2">"{item.content}"</p>
                    <p className="text-xs text-white/60 mt-2">{item.productName} • View details</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Swipe indicator animation */}
          <div className="absolute bottom-24 right-4 z-20 flex flex-col items-center animate-pulse">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-1 animate-bounce"></div>
            </div>
          </div>
        </>
      ) : (
        // No data state
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-white/80">No reviews available yet.</p>
        </div>
      )}
    </div>
  );

  // Render desktop view with TripAdvisor-style grid layout
  const renderDesktopView = () => (
    <div className="w-full">
      {/* TripAdvisor-style filter bar */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-md border border-gray-200">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-3">
            <div className="flex items-center gap-1 bg-[#f2f2f2] rounded-full px-4 py-1.5 text-sm text-gray-700 font-medium border border-gray-200">
              <span>All ({testimonialItems.length})</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#f2f2f2] rounded-full px-4 py-1.5 text-sm text-gray-700 font-medium border border-gray-200">
              <Star className="w-4 h-4 fill-[#00aa6c] text-[#00aa6c]" />
              <span>5.0</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#f2f2f2] rounded-full px-4 py-1.5 text-sm text-gray-700 font-medium border border-gray-200">
              <Star className="w-4 h-4 fill-[#00aa6c] text-[#00aa6c]" />
              <span>4.0+</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#f2f2f2] rounded-full px-4 py-1.5 text-sm text-gray-700 font-medium border border-gray-200">
              <Users className="w-4 h-4" />
              <span>Family</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1 hover:bg-[#f2f2f2] rounded-full px-4 py-1.5 text-sm text-gray-700 font-medium border border-gray-200">
              <span>Sort by: Recent</span>
            </div>
          </div>
        </div>
                </div>
      
      {isLoading ? (
        // Skeleton loading state for desktop
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden h-[350px] shadow-md border border-gray-200">
              <Skeleton className="h-full w-full bg-gray-200" />
            </div>
          ))}
        </div>
      ) : testimonialItems.length > 0 ? (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {testimonialItems.map((item, index) => (
              <DesktopReelItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
          ) : (
            // No data state
        <div className="text-center py-12">
          <p className="text-gray-700">No reviews available yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-gray-900">Traveler Reviews</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#00aa6c] text-[#00aa6c]" />
              ))}
            </div>
            <span className="text-xl font-medium text-gray-900">4.8</span>
            <span className="text-gray-500">(356 reviews)</span>
          </div>
          <p className="max-w-2xl mx-auto text-gray-600">
            See what travelers are saying about their experiences
          </p>
        </div>
        
        <div className="mx-auto">
          {isDesktopView ? renderDesktopView() : (
            <div className="max-w-[400px] mx-auto">
              {renderMobileView()}
            </div>
          )}
          
          {/* TripAdvisor-style footer */}
          <div className="mt-8 text-center">
            <a 
              href="https://tripadvisor.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white bg-[#00aa6c] hover:bg-[#00aa6c]/90 transition-colors font-medium px-6 py-2 rounded-full"
            >
              <span>See all reviews on TripAdvisor</span>
            </a>
            <p className="text-xs text-gray-500 mt-3">
              Reviews are sourced from verified travelers who used our services
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
