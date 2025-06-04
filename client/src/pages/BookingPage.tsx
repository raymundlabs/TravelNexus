import React, { useState, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
// Use a simple function to generate IDs instead of uuid
const generateId = () => Math.random().toString(36).substring(2, 11);

// Define types
interface PackageData {
  id: string;
  name: string;
  price: number;
  fetured_image?: string | null;
  image_urls?: string[];
  description?: string;
}

export type GuestType = 'adult' | 'kid' | 'pwd' | 'senior' | 'toddler' | 'student';

export interface Guest {
  id: string;
  name: string;
  type: GuestType;

  dateOfBirth?: string;
  idFile?: File | null;
  idPreviewUrl?: string;
}

const guestTypeOptions: { value: GuestType; label: string }[] = [
  { value: 'adult', label: 'Adult' },
  { value: 'kid', label: 'Kid (3-12 years)' },
  { value: 'toddler', label: 'Toddler (0-2 years)' },
  { value: 'senior', label: 'Senior Citizen' },
  { value: 'pwd', label: 'PWD' },
  { value: 'student', label: 'Student' },
];

const BookingPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const calculateAge = (dobString?: string): number | undefined => {
    if (!dobString) return undefined;
    const parts = dobString.split('-'); // Expect YYYY-MM-DD
    if (parts.length !== 3) return undefined;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;

    const birthDate = new Date(year, month, day);
    // Check if date components form a valid date (e.g. not 2023-02-30)
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
        return undefined;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper to determine discount percentage
  const getDiscountPercentage = (guestType: GuestType, dateOfBirth?: string): number => {
    const age = calculateAge(dateOfBirth);

    switch (guestType) {
      case 'toddler':
        // Toddlers are 0-2 years old
        return (age !== undefined && age >= 0 && age <= 2) ? 1.0 : 0;
      case 'kid':
        // Kids (3-12 years label in options), discount for 3-5 years old based on previous logic
        return (age !== undefined && age >= 3 && age <= 5) ? 0.25 : 0;
      case 'pwd':
      case 'senior':
        return 0.20; // 20%
      default:
        return 0;
    }
  };

  const uploadIdFileToSupabase = async (file: File, userId: string | null, bookingRef: string): Promise<string | null> => {
    const fileName = `${uuidv4()}-${file.name}`;
    const userPathSegment = userId ? userId : 'guests';
    const filePath = `booking-documents/${userPathSegment}/${bookingRef}/${fileName}`; // Path adjusted: booking-documents is root folder in bucket
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('whitebeachuploads') // Bucket name corrected by user
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading ID file:', uploadError);
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('whitebeachuploads') // Bucket name corrected by user
        .getPublicUrl(filePath);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('File upload process error:', error);
      // Potentially return a specific error or null to indicate failure
      return null;
    }
  };

  const maxBirthDate = new Date().toISOString().split('T')[0];
  const params = useParams();
  const packageId = params.packageId;
  const [, setLocation] = useLocation();

  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mainGuestName, setMainGuestName] = useState('');
  const [mainGuestDob, setMainGuestDob] = useState('');
  const [mainGuestIdFile, setMainGuestIdFile] = useState<File | null>(null);
  const [mainGuestIdPreview, setMainGuestIdPreview] = useState<string>('');
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) {
        setError('Package ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('packages')
          .select('*')
          .eq('id', packageId)
          .single();

        if (dbError) throw dbError;
        if (!data) throw new Error('Package not found.');

        setPackageData(data as PackageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch package details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleAddGuest = () => {
    setGuests([...guests, { id: generateId(), name: '', type: 'adult', dateOfBirth: undefined }]);
  };

  const handleRemoveGuest = (id: string) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  // Helper to create preview URL for ID files (for both main guest and additional guests)
  const generateIdPreview = (file: File, callback: (url: string) => void) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      callback(''); // Cletestawerwrwer preview if not an image or no file, or if file is PDF
    }
  };

  const handleGuestIdFileChange = (guestId: string, file: File | null) => {
    setGuests(prevGuests =>
      prevGuests.map(guest => {
        if (guest.id === guestId) {
          if (file) {
            // Basic validation for guest ID files
            if (!file.type.match('image/.*') && file.type !== 'application/pdf') {
              alert('Guest ID: Please upload an image (JPEG, PNG) or PDF file.');
              return { ...guest, idFile: null, idPreviewUrl: '' }; // Keep existing or clear
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
              alert('Guest ID: File size should be less than 5MB.');
              return { ...guest, idFile: null, idPreviewUrl: '' }; // Keep existing or clear
            }
            generateIdPreview(file, (previewUrl) => {
              setGuests(currentGuests => currentGuests.map(g => g.id === guestId ? {...g, idPreviewUrl: previewUrl} : g));
            });
            return { ...guest, idFile: file };
          } else {
            return { ...guest, idFile: null, idPreviewUrl: '' };
          }
        }
        return guest;
      })
    );
  };

  const handleGuestChange = (id: string, field: keyof Omit<Guest, 'id' | 'idFile' | 'idPreviewUrl' | 'age'>, value: string | GuestType | undefined) => {
    setGuests(guests.map(guest => 
      guest.id === id 
        ? { 
            ...guest, 
            [field]: value
            // Removed age reset logic as age field is removed
          } 
        : guest
    ));
  };

  const calculateGuestPrice = (guest: Guest, basePrice: number): number => {
    const age = calculateAge(guest.dateOfBirth);

    switch (guest.type) {
      case 'toddler':
        // Toddlers (0-2) are free, as per getDiscountPercentage
        if (age !== undefined && age >= 0 && age <= 2) return 0;
        // If age is not in toddler range but type is toddler, could be an error or they pay full.
        // For now, assuming if type is toddler, and age matches, it's free. Otherwise, they might not qualify for 'toddler' type.
        // Let's rely on getDiscountPercentage for consistency or re-evaluate if toddlers outside 0-2 pay full or are invalid.
        // Based on getDiscountPercentage, they would pay full if age is outside 0-2.
        return basePrice * (1 - getDiscountPercentage(guest.type, guest.dateOfBirth)); 
      case 'kid':
        // Kids (3-5) get 25% discount, other kids pay full price.
        // This logic is now encapsulated in getDiscountPercentage.
        return basePrice * (1 - getDiscountPercentage(guest.type, guest.dateOfBirth));
      case 'pwd':
      case 'senior':
        return basePrice * (1 - getDiscountPercentage(guest.type, guest.dateOfBirth)); // 20% discount
      case 'adult':
      case 'student':
      default:
        return basePrice; // No discount from getDiscountPercentage by default
    }
  };

  const totalPrice = useMemo(() => {
    if (!packageData) return 0;
    let total = 0;
    
    // Main guest is considered an adult
    if (mainGuestName.trim() !== '') {
        total += packageData.price; 
    }

    // Add prices for additional guests
    guests.forEach(guest => {
      total += calculateGuestPrice(guest, packageData.price);
    });
    
    return total;
  }, [guests, packageData, mainGuestName]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to proceed with your booking.');
      setIsSubmitting(false);
      return;
    }
    
    if (!packageData || !mainGuestName.trim()) {
      alert('Please provide main guest name and ensure package data is loaded.');
      setIsSubmitting(false);
      return;
    }

    // Validate guest DOB if type requires age-based logic
    for (const guest of guests) {
      if (guest.type === 'kid' || guest.type === 'toddler') {
        if (!guest.dateOfBirth) {
          alert(`Please provide Date of Birth for guest: ${guest.name || 'Unnamed Guest'} (type: ${guest.type}).`);
          setIsSubmitting(false);
          return;
        }
        const age = calculateAge(guest.dateOfBirth);
        if (age === undefined) { // Should not happen if DOB is validated by input, but good check
            alert(`Invalid Date of Birth for guest: ${guest.name || 'Unnamed Guest'}.`);
            setIsSubmitting(false);
            return;
        }
        if (guest.type === 'toddler' && (age < 0 || age > 2)) {
            alert(`Guest ${guest.name || 'Unnamed Guest'} is selected as 'Toddler' but age (${age}) is not between 0-2 years.`);
            setIsSubmitting(false);
            return;
        }
        // For 'kid', the discount is for 3-5. The label says 'Kid (3-12 years)'. 
        // We will allow any age if type is 'kid', but discount applies only if 3-5.
        // No specific age range validation for 'kid' type beyond DOB presence for now, as per memory a3d09b5a-99f4-4ba9-bca5-66a7ac970342 (age only strictly *required* for kid/toddler for *pricing*)
      }
    }

    // --- Start Supabase Save Logic ---
    try {
      const { data: { user } } = await supabase.auth.getUser(); // userError can be ignored for guest checkout
      const userId = user?.id || null; // If no user, userId will be null
      const bookingReference = uuidv4().toUpperCase();

      // 1. Upload ID files (if they exist)
      let mainGuestIdUrl: string | null = null;
      if (mainGuestIdFile) {
        mainGuestIdUrl = await uploadIdFileToSupabase(mainGuestIdFile, userId, bookingReference);
        if (!mainGuestIdUrl) {
          alert('Failed to upload main guest ID. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const additionalGuestsWithIdUrls = await Promise.all(
        guests.map(async (guest) => {
          let idFileUrl: string | null = null;
          if (guest.idFile) {
            idFileUrl = await uploadIdFileToSupabase(guest.idFile, userId, bookingReference);
            if (!idFileUrl) {
              // If one guest ID fails, we might want to stop or collect all errors
              throw new Error(`Failed to upload ID for guest: ${guest.name}`);
            }
          }
          return { ...guest, id_document_url: idFileUrl };
        })
      );

      // 2. Prepare data for 'bookings' table
      const bookingStartDate = new Date().toISOString(); // Placeholder - ควรมาจาก package data หรือ user input
      const bookingEndDate = new Date().toISOString();   // Placeholder - ควรมาจาก package data หรือ user input
      
      const numTotalGuests = 1 + guests.length;
      const calculatedSubtotalPrice = (packageData.price || 0) * numTotalGuests;
      const calculatedDiscountAmount = calculatedSubtotalPrice - totalPrice;

      const itemIdInt = parseInt(packageData.id, 10);
      if (isNaN(itemIdInt)) {
        console.error(`Error: Package ID "${packageData.id}" is not a valid integer.`);
        alert(`Error: The Package ID found ("${packageData.id}") is not a valid number. This booking cannot be processed. Please check the URL or contact support.`);
        setIsSubmitting(false);
        return;
      }

      const bookingDataForTable = {
        booking_reference: bookingReference,
        user_id: userId, // This will be null for guest bookings
        booking_type: 'package', // Assuming 'package' for this booking page
        item_id: itemIdInt, // Using the parsed integer ID
        agent_id: null, // Placeholder
        start_date: bookingStartDate,
        end_date: bookingEndDate,
        guests: numTotalGuests,
        subtotal_price: calculatedSubtotalPrice,
        discount_amount: calculatedDiscountAmount > 0 ? calculatedDiscountAmount : 0,
        tax_amount: 0, // Placeholder
        total_price: totalPrice,
        status: 'pending',
        // special_requests: null, // Add if you collect this
      };

      // 3. Insert into 'bookings' table
      const { data: newBooking, error: bookingInsertError } = await supabase
        .from('bookings')
        .insert(bookingDataForTable)
        .select()
        .single();

      if (bookingInsertError || !newBooking) {
        console.error('Error inserting booking:', bookingInsertError);
        alert('Failed to create booking. Error: ' + (bookingInsertError?.message || 'Unknown error'));
        setIsSubmitting(false);
        return;
      }
      const newBookingId = newBooking.id;

      // 4. Prepare data for 'booking_details' table
      const mainGuestDetail = {
        booking_id: newBookingId,
        guest_type: 'adult',
        is_main_guest: true,
        full_name: mainGuestName,
        date_of_birth: mainGuestDob || null,
        age: calculateAge(mainGuestDob),
        id_document_url: mainGuestIdUrl,
        price: packageData.price, // Base price for this guest
        discount_percentage: 0, // Assuming main adult has no standard discount
        discount_amount: 0,
        final_price: packageData.price,
      };

      const additionalGuestDetails = additionalGuestsWithIdUrls.map(guest => {
        const guestBasePrice = packageData.price;
        const calculatedGuestAge = calculateAge(guest.dateOfBirth);
        const discountPercentage = getDiscountPercentage(guest.type, guest.dateOfBirth);
        const discountAmount = guestBasePrice * discountPercentage;
        const finalPrice = calculateGuestPrice(guest, guestBasePrice);
        return {
          booking_id: newBookingId,
          guest_type: guest.type,
          is_main_guest: false,
          full_name: guest.name,
          date_of_birth: guest.dateOfBirth || null,
          age: calculatedGuestAge,
          id_document_url: guest.id_document_url,
          price: guestBasePrice,
          discount_percentage: discountPercentage,
          discount_amount: discountAmount,
          final_price: finalPrice,
        };
      });

      const allGuestDetails = [mainGuestDetail, ...additionalGuestDetails];

      // 5. Insert into 'booking_details' table
      const { error: detailsInsertError } = await supabase
        .from('booking_details')
        .insert(allGuestDetails);

      if (detailsInsertError) {
        console.error('Error inserting booking details:', detailsInsertError);
        // CRITICAL: Booking created, but details failed. May need manual cleanup or a compensation mechanism.
        alert('Booking created, but failed to save all guest details. Please contact support. Error: ' + detailsInsertError.message);
        setIsSubmitting(false);
        return;
      }

      // --- End Supabase Save Logic ---

    // Original console log and alert for booking details (can be removed or adapted)
    const bookingDetails = {
      packageId: packageData.id,
      packageName: packageData.name,
      mainGuest: {
        name: mainGuestName,
        dateOfBirth: mainGuestDob,
        idFileName: mainGuestIdFile?.name || 'N/A',
        price: packageData.price // Main guest price is the base package price
      },
      additionalGuests: guests.map(g => ({ 
        name: g.name, 
        type: g.type, 
        age: g.age, 
        dateOfBirth: g.dateOfBirth,
        idFileName: g.idFile?.name || 'N/A',
        price: calculateGuestPrice(g, packageData.price) 
      })),
      totalPrice,
      bookedAt: new Date().toISOString(),
    };

    console.log('Booking Details:', bookingDetails);
    
    // Here you would typically save the booking to your database
    // For now, we'll just show an alert
    alert(`Booking successfully submitted! Your Booking Reference: ${bookingReference}. This would proceed to payment in a real application.`);
    // Optionally, redirect to a success page or clear the form
    // setLocation(`/booking-success/${bookingReference}`);
    // Reset form state here if needed
    } catch (error) {
      console.error('Booking submission process error:', error);
      alert('An unexpected error occurred during booking: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="container mx-auto p-4 text-center">Loading package details...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  if (!packageData) return <div className="container mx-auto p-4 text-center">Package not found.</div>;

  const displayImageUrl = packageData.fetured_image || 
    (packageData.image_urls && packageData.image_urls.length > 0 ? 
      packageData.image_urls[0] : '/images/placeholder-package.jpg');

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => setLocation(`/package/${packageId}`)} className="mb-6 text-primary hover:underline">
          &larr; Back to Package Details
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Complete Your Booking</h1>

        <form onSubmit={handleBookingSubmit} className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          {/* Package Summary */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Selected Package</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img 
                src={displayImageUrl} 
                alt={packageData.name} 
                className="w-full sm:w-48 h-32 sm:h-auto object-cover rounded-lg shadow-md"
              />
              <div>
                <h3 className="text-xl font-medium text-gray-900">{packageData.name}</h3>
                <p className="text-gray-600 mt-1">Base Price: <span className="font-semibold">₱{packageData.price.toFixed(2)}</span> per adult</p>
                {packageData.description && <p className="text-sm text-gray-500 mt-2 hidden md:block">{packageData.description.substring(0,150)}...</p>}
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Guest Information</h2>
            
            {/* Main Guest */}
            <div className="mb-6">
              <label htmlFor="mainGuestName" className="block text-sm font-medium text-gray-700 mb-1">
                Main Guest Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mainGuestName"
                value={mainGuestName}
                onChange={(e) => setMainGuestName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., Jane Doe"
              />
              {/* DOB and ID for Main Guest moved below name for clarity */}
            </div>
            <div className="mb-6">
              <label htmlFor="mainGuestDob" className="block text-sm font-medium text-gray-700 mb-1">
                Main Guest Date of Birth
              </label>
              <input
                type="date"
                id="mainGuestDob"
                value={mainGuestDob}
                onChange={(e) => setMainGuestDob(e.target.value)}
                max={maxBirthDate}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="mainGuestIdFile" className="block text-sm font-medium text-gray-700 mb-1">
                Main Guest Valid ID (Optional - Image or PDF, max 5MB)
              </label>
              <input
                type="file"
                id="mainGuestIdFile"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!file.type.match('image/.*') && file.type !== 'application/pdf') {
                      alert('Main Guest ID: Please upload an image (JPEG, PNG) or PDF file.');
                      setMainGuestIdFile(null); setMainGuestIdPreview(''); e.target.value = ''; // Reset file input
                      return;
                    }
                    if (file.size > 5 * 1024 * 1024) { // 5MB limit
                      alert('Main Guest ID: File size should be less than 5MB.');
                      setMainGuestIdFile(null); setMainGuestIdPreview(''); e.target.value = ''; // Reset file input
                      return;
                    }
                    setMainGuestIdFile(file);
                    generateIdPreview(file, setMainGuestIdPreview);
                  } else {
                    setMainGuestIdFile(null);
                    setMainGuestIdPreview('');
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary-dark hover:file:text-white"
              />
              {mainGuestIdPreview && (
                <img src={mainGuestIdPreview} alt="Main Guest ID Preview" className="mt-2 h-32 w-auto object-contain border rounded" />
              )}
              {mainGuestIdFile && !mainGuestIdPreview && mainGuestIdFile.type === 'application/pdf' && (
                 <p className="text-sm text-gray-600 mt-2">PDF selected: {mainGuestIdFile.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">The main guest is considered an adult for pricing.</p>
            </div>

            {/* Additional Guests */}
            <h3 className="text-lg font-medium text-gray-700 mb-1">Additional Guests</h3>
            <p className="text-xs text-gray-500 mb-3">Add anyone else joining this booking.</p>
            
            {guests.map((guest, index) => (
              <div key={guest.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 items-end"> {/* items-end for button alignment */} 
                <div className="md:col-span-4">
                  <label htmlFor={`guestName-${guest.id}`} className="block text-xs font-medium text-gray-600">
                    Guest {index + 1} Name
                  </label>
                  <input
                    type="text"
                    id={`guestName-${guest.id}`}
                    value={guest.name}
                    onChange={(e) => handleGuestChange(guest.id, 'name', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label htmlFor={`guestType-${guest.id}`} className="block text-xs font-medium text-gray-600">Type</label>
                  <select
                    id={`guestType-${guest.id}`}
                    value={guest.type}
                    onChange={(e) => handleGuestChange(guest.id, 'type', e.target.value as GuestType)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm h-[42px]"
                  >
                    {guestTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* DOB for Additional Guest */}
                <div className="md:col-span-3"> 
                  <label htmlFor={`guestDob-${guest.id}`} className="block text-xs font-medium text-gray-600">
                    DOB
                  </label>
                  <input
                    type="date"
                    id={`guestDob-${guest.id}`}
                    value={guest.dateOfBirth || ''}
                    onChange={(e) => handleGuestChange(guest.id, 'dateOfBirth', e.target.value)}
                    max={maxBirthDate}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm"
                  />
                </div>
                
                <div className={`md:col-span-1 flex items-center pt-5 md:pt-0`}>
                  {packageData && (
                    <p className="text-sm text-gray-700 font-semibold w-full text-right">
                      ₱{calculateGuestPrice(guest, packageData.price).toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className={`md:col-span-2 flex items-end`}>
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(guest.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 border border-transparent rounded-md bg-red-100 hover:bg-red-200 h-[42px] self-end"
                  >
                    Remove
                  </button>
                </div>
                {/* ID Upload for Additional Guest - New Row conceptually */}
                <div className="md:col-span-12 mt-3">
                  <label htmlFor={`guestIdFile-${guest.id}`} className="block text-xs font-medium text-gray-600">
                    Guest {index + 1} Valid ID (Optional - Image or PDF, max 5MB)
                  </label>
                  <input
                    type="file"
                    id={`guestIdFile-${guest.id}`}
                    accept="image/*,.pdf"
                    onChange={(e) => handleGuestIdFileChange(guest.id, e.target.files ? e.target.files[0] : null)}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary-dark hover:file:text-white"
                  />
                  {guest.idPreviewUrl && (
                    <img src={guest.idPreviewUrl} alt={`Guest ${index + 1} ID Preview`} className="mt-2 h-24 w-auto object-contain border rounded" />
                  )}
                  {guest.idFile && !guest.idPreviewUrl && guest.idFile.type === 'application/pdf' && (
                    <p className="text-sm text-gray-600 mt-2">PDF selected: {guest.idFile.name}</p>
                  )}
                </div>
              </div>
            </div>
            ))}
            
            <button 
              type="button" 
              onClick={handleAddGuest} 
              className="mt-2 px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 text-sm"
            >
              + Add Another Guest
            </button>
          </div>

          {/* Price Summary */}
          <div className="mt-10 pt-6 border-t border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Booking Summary</h2>
            <div className="space-y-2">
              {mainGuestName.trim() && packageData && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{mainGuestName} (Main Guest - Adult)</span>
                  <span className="font-medium text-gray-800">₱{packageData.price.toFixed(2)}</span>
                </div>
              )}
              
              {guests.map(guest => (
                <div key={`summary-${guest.id}`} className="flex justify-between">
                  <span className="text-gray-600">
                    {guest.name || `Guest (${guest.type})`} {guest.age !== undefined ? `(Age ${guest.age})` : ''}
                  </span>
                  <span className="font-medium text-gray-800">
                    ₱{packageData ? calculateGuestPrice(guest, packageData.price).toFixed(2) : 'N/A'}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200 mt-3">
                <span>Total Price:</span>
                <span>₱{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a 
                    href="/terms-and-conditions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark font-medium underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms and Conditions
                  </a>
                  {' '}and understand my personal data will be processed in accordance with the Privacy Policy.
                </label>
              </div>
            </div>
            {!acceptedTerms && (
              <p className="mt-1 text-sm text-red-600">You must accept the terms and conditions to proceed.</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button 
              type="submit" 
              className="w-full md:w-auto px-12 py-3 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-primary-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm & Proceed'}
            </button>
            <p className="text-xs text-gray-500 mt-3">You will be able to review before payment.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
