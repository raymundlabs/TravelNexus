import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';

// Custom hook for media query
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

// Interface for the Package data, matching the Supabase table schema
interface Package {
  id: number;
  name: string;
  description: string;
  destination_id: number;
  duration: string;
  price: number;
  discounted_price?: number | null;
  image_urls: string[];
  fetured_image?: string | null;
  rating?: number | null;
  review_count?: number | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  is_bestseller?: boolean | null;
  discount_percentage?: number | null;
  featured?: boolean | null;
}

// Interface for the form state
interface PackageFormState {
  name: string;
  description: string;
  destination_id: string;
  duration: string;
  price: string;
  discounted_price: string;
  image_urls: string;
  fetured_image: string;
  rating: string;
  review_count: string;
  highlights: string;
  inclusions: string;
  is_bestseller: boolean;
  discount_percentage: string;
  featured: boolean;
}

// Interface for the Destination data
interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  image_url: string;
  rating?: number | null;
  review_count?: number | null;
};

const initialFormState: PackageFormState = {
  name: "",
  description: "",
  destination_id: "",
  duration: "",
  price: "",
  discounted_price: "",
  image_urls: "",
  fetured_image: "",
  rating: "",
  review_count: "0",
  highlights: "",
  inclusions: "",
  is_bestseller: false,
  discount_percentage: "",
  featured: false,
};

interface PackageCardProps {
  pkg: Package;
  onEdit: (pkg: Package) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onEdit, onDelete, isLoading }) => {
  const displayImageUrl = pkg.fetured_image 
    ? pkg.fetured_image 
    : (pkg.image_urls && pkg.image_urls.length > 0 
        ? pkg.image_urls[0] 
        : 'https://via.placeholder.com/400x200?text=No+Image');
  return (
    <Card key={pkg.id} className="flex flex-col w-full shadow-lg">
      <CardHeader className="p-0 relative">
        <img 
          src={displayImageUrl} 
          alt={pkg.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex flex-col space-y-1 items-end">
            {pkg.featured && <Badge variant="default" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 text-xs">Featured</Badge>}
            {pkg.is_bestseller && <Badge variant="default" className="bg-green-400 hover:bg-green-500 text-green-800 text-xs">Bestseller</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-semibold mb-2 truncate" title={pkg.name}>{pkg.name}</CardTitle>
        <p className="text-xs text-gray-600 mb-1"><strong>ID:</strong> {pkg.destination_id} | <strong>Duration:</strong> {pkg.duration}</p>
        <div className="my-2">
          <span className={`text-md font-bold ${pkg.discounted_price ? 'text-red-600' : 'text-gray-800'}`}>
            ₱{pkg.discounted_price ? pkg.discounted_price.toLocaleString() : pkg.price.toLocaleString()}
          </span>
          {pkg.discounted_price && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              ₱{pkg.price.toLocaleString()}
            </span>
          )}
          {pkg.discount_percentage && pkg.discounted_price && (
             <Badge variant="destructive" className="ml-1 text-xs">{pkg.discount_percentage}% off</Badge>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2 h-10 overflow-hidden" title={pkg.description}>{pkg.description}</p>
        
        {pkg.rating !== null && typeof pkg.rating !== 'undefined' && (
            <p className="text-xs text-gray-600">
                <strong>Rating:</strong> {pkg.rating}/5 ({pkg.review_count || 0} reviews)
            </p>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(pkg)} disabled={isLoading}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(pkg.id)} disabled={isLoading}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [form, setForm] = useState<PackageFormState>(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]); // Added missing state declaration

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setIsLoadingDestinations(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('destinations')
        .select('*')
        .order('name', { ascending: true });
      if (fetchError) throw fetchError;
      setDestinations(data || []);
    } catch (err: any) {
      console.error("Fetch destinations error:", err);
      // setError(err.message || "Failed to fetch destinations"); // Optionally set a specific error for destinations
    }
    setIsLoadingDestinations(false);
  };

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('packages')
        .select('*')
        .order('id', { ascending: true });
      if (fetchError) throw fetchError;
      setPackages(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch packages");
      console.error("Fetch error:", err);
    }
    setIsLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prevForm => ({ ...prevForm, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImageFiles(Array.from(e.target.files));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const resetFormAndModal = () => {
    setForm(initialFormState);
    setEditingPackage(null);
    setIsModalOpen(false);
    setError(null);
    setSelectedImageFiles([]); // Ensure selected files are reset
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    let finalImageUrls: string[] = [];

    if (selectedImageFiles.length > 0) {
      const uploadPromises = selectedImageFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `public/${fileName}`; // Path within the bucket

        const { error: uploadError } = await supabase.storage
          .from('whitebeachuploads') // Corrected bucket name
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('whitebeachuploads') // Corrected bucket name
          .getPublicUrl(filePath);
        
        if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error(`Failed to get public URL for ${file.name}`);
        }
        return publicUrlData.publicUrl;
      });

      try {
        finalImageUrls = await Promise.all(uploadPromises);
      } catch (uploadError: any) {
        console.error("Image upload error:", uploadError);
        setError(uploadError.message || "Failed to upload one or more images.");
        setIsLoading(false);
        return;
      }
    } else if (editingPackage && form.image_urls) {
      // No new files selected during edit, retain existing URLs if any
      finalImageUrls = form.image_urls.split(',').map(url => url.trim()).filter(url => url);
    } else if (!editingPackage && form.image_urls) {
      // This case might occur if form.image_urls had some default or residual value
      // For a new package with no files selected, it should be an empty array.
      finalImageUrls = form.image_urls.split(',').map(url => url.trim()).filter(url => url); 
    }

    const highlightsArray = form.highlights.split(',').map(s => s.trim()).filter(s => s);
    const inclusionsArray = form.inclusions.split(',').map(s => s.trim()).filter(s => s);

    // Determine the featured image URL - defaults to the first image if available
    const feturedImageUrl: string | null = finalImageUrls.length > 0 ? finalImageUrls[0] : null;

    const processedPackageData = {
      name: form.name,
      description: form.description,
      destination_id: parseInt(form.destination_id, 10),
      duration: form.duration,
      price: parseFloat(form.price),
      discounted_price: form.discounted_price ? parseFloat(form.discounted_price) : null,
      image_urls: finalImageUrls, 
      fetured_image: feturedImageUrl, // Add fetured_image to data
      rating: form.rating ? parseFloat(form.rating) : null,
      review_count: form.review_count ? parseInt(form.review_count, 10) : 0,
      highlights: highlightsArray.length > 0 ? highlightsArray : null,
      inclusions: inclusionsArray.length > 0 ? inclusionsArray : null,
      is_bestseller: form.is_bestseller,
      discount_percentage: form.discount_percentage ? parseFloat(form.discount_percentage) : null,
      featured: form.featured,
    };

    if (isNaN(processedPackageData.destination_id) || isNaN(processedPackageData.price)) {
        setError("Destination ID and Price must be valid numbers.");
        setIsLoading(false);
        return;
    }

    try {
      if (editingPackage) {
        const { data, error: updateError } = await supabase
          .from('packages')
          .update(processedPackageData)
          .eq('id', editingPackage.id)
          .select(); // Add select to get the updated row back
        if (updateError) throw updateError;
        if (data && data.length > 0) {
            // Update the package in the local state
            setPackages(pkgs => pkgs.map(p => p.id === editingPackage.id ? data[0] : p));
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('packages')
          .insert(processedPackageData)
          .select(); // Add select to get the new row back
        if (insertError) throw insertError;
        if (data && data.length > 0) {
            setPackages(pkgs => [data[0], ...pkgs]); // Add new package to the beginning of the list
        }
      }
      resetFormAndModal();
    } catch (err: any) {
      setError(err.message || (editingPackage ? "Failed to update package" : "Failed to add package"));
      console.error("Submit error:",err);
    }
    setIsLoading(false);
  };

  const handleOpenEditModal = (pkg: Package) => {
    setEditingPackage(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description,
      destination_id: String(pkg.destination_id),
      duration: pkg.duration,
      price: String(pkg.price),
      discounted_price: pkg.discounted_price ? String(pkg.discounted_price) : "",
      image_urls: pkg.image_urls ? (Array.isArray(pkg.image_urls) ? pkg.image_urls.join(", ") : (typeof pkg.image_urls === 'string' ? (console.warn(`Package ID ${pkg.id} image_urls is a string: '${pkg.image_urls}' and will be used as is. Check data for this package.`), pkg.image_urls) : "")) : "",
      fetured_image: pkg.fetured_image || "", // Populate fetured_image
      rating: pkg.rating ? String(pkg.rating) : "",
      review_count: pkg.review_count ? String(pkg.review_count) : "0",
      highlights: pkg.highlights ? pkg.highlights.join(', ') : "",
      inclusions: pkg.inclusions ? pkg.inclusions.join(', ') : "",
      is_bestseller: pkg.is_bestseller || false,
      discount_percentage: pkg.discount_percentage ? String(pkg.discount_percentage) : "",
      featured: pkg.featured || false,
    });
    setIsModalOpen(true);
  };
  
  const handleOpenAddModal = () => {
    setEditingPackage(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('packages').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setPackages(pkgs => pkgs.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete package");
      console.error("Delete error:",err);
    }
    setIsLoading(false);
  };

  const filteredPackages = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) return packages;
    return packages.filter(pkg => 
      pkg.name.toLowerCase().includes(lowerSearchTerm) || 
      String(pkg.id).includes(lowerSearchTerm)
    );
  }, [packages, searchTerm]);

  const destinationMap = useMemo(() => {
    return new Map(destinations.map(dest => [dest.id, dest.name]));
  }, [destinations]);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Travel Packages</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
          <Input 
            placeholder="Search packages by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm order-2 sm:order-1"
          />
          <Button onClick={handleOpenAddModal} disabled={isLoading} className="w-full sm:w-auto order-1 sm:order-2">
            Add New Package
          </Button>
        </div>

        {isLoading && packages.length === 0 && <p className="text-center">Loading packages...</p>}
        {!isLoading && filteredPackages.length === 0 && !error && (
          <p className="text-center text-gray-500">
            {searchTerm ? "No packages match your search." : "No packages found. Click 'Add New Package' to create one."}
          </p>
        )}

        {filteredPackages.length > 0 && (
          isMobile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPackages.map((pkg) => (
                <PackageCard 
                  key={pkg.id} 
                  pkg={pkg} 
                  onEdit={handleOpenEditModal} 
                  onDelete={handleDelete} 
                  isLoading={isLoading} 
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Destination Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <img 
                          src={pkg.fetured_image ? pkg.fetured_image : (pkg.image_urls && pkg.image_urls.length > 0 ? pkg.image_urls[0] : 'https://via.placeholder.com/100x60?text=No+Image')} 
                          alt={pkg.name} 
                          className="w-20 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{destinationMap.get(pkg.destination_id) || pkg.destination_id}</TableCell>
                    <TableCell>
                      {pkg.discounted_price ? (
                        <>
                          <span className="text-red-600 font-bold">₱{pkg.discounted_price.toLocaleString()}</span>
                          <span className="ml-2 text-xs text-gray-500 line-through">₱{pkg.price.toLocaleString()}</span>
                          {pkg.discount_percentage && 
                            <Badge variant="destructive" className="ml-2">{pkg.discount_percentage}% off</Badge>
                          }
                        </>
                      ) : (
                        <span>₱{pkg.price.toLocaleString()}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-1">
                          {pkg.featured && <Badge variant="default" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800">Featured</Badge>}
                          {pkg.is_bestseller && <Badge variant="default" className="bg-green-400 hover:bg-green-500 text-green-800">Bestseller</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(pkg)} className="mr-2" disabled={isLoading}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg.id)} disabled={isLoading}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
              {editingPackage && <DialogDescription>Make changes to your package here. Click save when you're done.</DialogDescription>}
              {!editingPackage && <DialogDescription>Enter the details for the new package. Click save when you're done.</DialogDescription>}
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="destination_id">Destination Name</Label>
                  <Select 
                    name="destination_id"
                    value={form.destination_id}
                    onValueChange={(value) => handleSelectChange('destination_id', value)}
                    disabled={isLoading || isLoadingDestinations}
                  >
                    <SelectTrigger id="destination_id">
                      <SelectValue placeholder={isLoadingDestinations ? "Loading destinations..." : "Select a destination"} />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem key={dest.id} value={String(dest.id)}>
                          {dest.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (e.g., 7 Days)</Label>
                  <Input id="duration" name="duration" value={form.duration} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="discounted_price">Discounted Price (Optional)</Label>
                  <Input id="discounted_price" name="discounted_price" type="number" step="0.01" value={form.discounted_price} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="discount_percentage">Discount Percentage (Optional, e.g., 10 for 10%)</Label>
                  <Input id="discount_percentage" name="discount_percentage" type="number" value={form.discount_percentage} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="image_files">Upload Images</Label>
                  <Input 
                    id="image_files" 
                    name="image_files" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    disabled={isLoading} 
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {selectedImageFiles.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      Selected files: {selectedImageFiles.map(f => f.name).join(', ')}
                    </div>
                  )}
                  {editingPackage && form.image_urls && selectedImageFiles.length === 0 && (
                     <div className="mt-2 text-xs text-gray-500">
                        Current images (URLs): {form.image_urls}
                        <p className="text-orange-500 text-xs">To replace these, select new image files above.</p>
                     </div>
                  )}
                   {editingPackage && selectedImageFiles.length > 0 && (
                    <p className="mt-1 text-xs text-orange-500">New files selected will replace all current images upon saving.</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="rating">Rating (Optional, e.g., 4.5)</Label>
                  <Input id="rating" name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} disabled={isLoading} />
                </div>
                 <div>
                  <Label htmlFor="review_count">Review Count (Optional)</Label>
                  <Input id="review_count" name="review_count" type="number" value={form.review_count} onChange={handleChange} disabled={isLoading} />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} required disabled={isLoading} rows={3}/>
              </div>
              
              <div>
                <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                <Textarea id="highlights" name="highlights" value={form.highlights} onChange={handleChange} placeholder="e.g., Free breakfast, Airport transfer" disabled={isLoading} rows={2}/>
              </div>
              <div>
                <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
                <Textarea id="inclusions" name="inclusions" value={form.inclusions} onChange={handleChange} placeholder="e.g., Accommodation, Guided tours" disabled={isLoading} rows={2}/>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" name="featured" checked={form.featured} onCheckedChange={(checked) => setForm(prev => ({...prev, featured: !!checked}))} disabled={isLoading} />
                  <Label htmlFor="featured">Featured Package</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="is_bestseller" name="is_bestseller" checked={form.is_bestseller} onCheckedChange={(checked) => setForm(prev => ({...prev, is_bestseller: !!checked}))} disabled={isLoading} />
                  <Label htmlFor="is_bestseller">Bestseller Package</Label>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={resetFormAndModal} disabled={isLoading}>
                    Cancel
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (editingPackage ? 'Updating...' : 'Adding...') : (editingPackage ? 'Save Changes' : 'Add Package')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}
