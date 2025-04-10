import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingTabType, BOOKING_TABS } from '@/lib/constants';
import { Building, Ship, Briefcase, Umbrella, Search, CalendarDays } from 'lucide-react';

const guestOptions = ['1 Guest', '2 Guests', '3 Guests', '4+ Guests'];

interface SearchWidgetProps {
  className?: string;
}

export default function SearchWidget({ className = '' }: SearchWidgetProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<BookingTabType>('hotels');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(guestOptions[0]);

  const handleTabClick = (tab: BookingTabType) => {
    setActiveTab(tab);
  };

  const handleSearch = () => {
    // Handle search based on active tab and form values
    const baseUrl = `/${activeTab}`;
    const query = new URLSearchParams();
    
    if (destination) query.set('destination', destination);
    if (checkIn) query.set('checkIn', checkIn);
    if (checkOut) query.set('checkOut', checkOut);
    if (guests) query.set('guests', guests);
    
    const queryString = query.toString();
    setLocation(`${baseUrl}${queryString ? `?${queryString}` : ''}`);
  };

  // Helper to get the appropriate icon
  const getTabIcon = (iconName: string) => {
    switch (iconName) {
      case 'suitcase':
        return <Briefcase className="h-5 w-5 mr-2" />;
      case 'bed':
        return <Building className="h-5 w-5 mr-2" />;
      case 'umbrella-beach':
        return <Umbrella className="h-5 w-5 mr-2" />;
      case 'ship':
        return <Ship className="h-5 w-5 mr-2" />;
      default:
        return <Briefcase className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 md:p-6 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {BOOKING_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`booking-tab flex flex-col items-center py-4 px-3 rounded-lg transition-colors ${
              activeTab === tab.value 
                ? 'bg-primary/10 text-primary border border-primary/30' 
                : 'bg-gray-50 text-neutral-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-center mb-1">
              {getTabIcon(tab.icon)}
              <span className="font-medium">{tab.label}</span>
            </div>
            {tab.description && (
              <p className="text-xs text-center mt-1 text-neutral-500">{tab.description}</p>
            )}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <label className="block text-neutral-600 text-left mb-2 font-medium">Destination</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Where are you going in White Beach, Puerto Galera?"
              className="w-full pl-10"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-neutral-600 text-left mb-2 font-medium">Check In</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              type="date"
              className="w-full pl-10"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-neutral-600 text-left mb-2 font-medium">Check Out</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              type="date"
              className="w-full pl-10"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-neutral-600 text-left mb-2 font-medium">Guests</label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select guests" />
            </SelectTrigger>
            <SelectContent>
              {guestOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={handleSearch}
          className="bg-secondary hover:bg-secondary-600 text-white py-3 px-8 text-lg"
        >
          <Search className="h-4 w-4 mr-2" /> Search White Beach
        </Button>
      </div>
    </div>
  );
}
