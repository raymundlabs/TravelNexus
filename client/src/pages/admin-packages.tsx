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
import { supabase } from "@/lib/supabase";

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
  image_url: string;
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
  image_url: string;
  rating: string;
  review_count: string;
  highlights: string;
  inclusions: string;
  is_bestseller: boolean;
  discount_percentage: string;
  featured: boolean;
};

// Interface for the Destination data, matching the Supabase table schema
interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  image_url: string;
  rating?: number | null;
  review_count?: number | null;
}

// Interface for the destination form state
interface DestinationFormState {
  id?: number; // For editing
  name: string;
  country: string;
  description: string;
  imageFile?: File | null; // For handling file upload
  image_url: string; // To store the URL after upload or for existing images
}

const initialDestinationFormState: DestinationFormState = {
  name: "",
  country: "",
  description: "",
  imageFile: null,
  image_url: "",
};

const initialFormState: PackageFormState = {
  name: "",
  description: "",
  destination_id: "",
  duration: "",
  price: "",
  discounted_price: "",
  image_url: "",
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
  return (
    <Card key={pkg.id} className="flex flex-col w-full shadow-lg">
      <CardHeader className="p-0 relative">
        <img 
          src={pkg.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
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
  const isMobile = useMediaQuery('(max-width: 768px)');

  // State for Destinations
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [destinationForm, setDestinationForm] = useState<DestinationFormState>(initialDestinationFormState);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false); // For image upload loading state
  const [destinationError, setDestinationError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
    fetchDestinations();
  }, []);

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
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const processedPackageData = {
      name: form.name,
      description: form.description,
      destination_id: parseInt(form.destination_id, 10),
      duration: form.duration,
      price: parseFloat(form.price),
      discounted_price: form.discounted_price ? parseFloat(form.discounted_price) : null,
      image_url: form.image_url,
      rating: form.rating ? parseFloat(form.rating) : null,
      review_count: form.review_count ? parseInt(form.review_count, 10) : 0,
      highlights: form.highlights ? form.highlights.split(',').map(s => s.trim()).filter(s => s) : null,
      inclusions: form.inclusions ? form.inclusions.split(',').map(s => s.trim()).filter(s => s) : null,
      is_bestseller: form.is_bestseller,
      discount_percentage: form.discount_percentage ? parseInt(form.discount_percentage, 10) : null,
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
          .select();
        if (updateError) throw updateError;
        if (data && data.length > 0) {
            setPackages(pkgs => pkgs.map(p => p.id === editingPackage.id ? data[0] : p));
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('packages')
          .insert(processedPackageData)
          .select();
        if (insertError) throw insertError;
        if (data && data.length > 0) {
            setPackages(pkgs => [...pkgs, data[0]]);
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
      image_url: pkg.image_url,
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
          <Button onClick={handleOpenAddModal} className="mb-4">Add New Package</Button>
          <Button onClick={openAddDestinationModal} className="mb-4 ml-2" variant="outline">Manage Destinations</Button>
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
                  <TableHead>Destination ID</TableHead>
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
                          src={pkg.image_url || 'https://via.placeholder.com/100x60?text=No+Image'} 
                          alt={pkg.name} 
                          className="w-20 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{pkg.destination_id}</TableCell>
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
                  <Label htmlFor="destination_id">Destination ID</Label>
                  <Input id="destination_id" name="destination_id" type="number" value={form.destination_id} onChange={handleChange} required disabled={isLoading} />
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
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input id="image_url" name="image_url" type="url" value={form.image_url} onChange={handleChange} required disabled={isLoading} />
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

        {/* Destination Management Dialog */}
        <Dialog open={isDestinationModalOpen} onOpenChange={setIsDestinationModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingDestination ? "Edit Destination" : "Add New Destination"}</DialogTitle>
              <DialogDescription>
                {editingDestination ? "Update the details of this destination." : "Fill in the details for the new destination. Image upload will be handled upon submission."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" value={destinationForm.name} onChange={handleDestinationChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Input id="country" name="country" value={destinationForm.country} onChange={handleDestinationChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" name="description" value={destinationForm.description} onChange={handleDestinationChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageFile" className="text-right">
                  Image
                </Label>
                <Input id="imageFile" name="imageFile" type="file" onChange={handleImageFileChange} className="col-span-3" accept="image/*" />
              </div>
              {destinationForm.image_url && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-start-2 col-span-3">
                        <img src={destinationForm.image_url} alt="Preview" className="mt-2 max-h-40 w-auto object-contain rounded" />
                    </div>
                </div>
              )}
            </div>
            {destinationError && <p className="text-sm text-red-500">{destinationError}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={closeDestinationModal}>Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={() => alert('Submit destination logic to be implemented')} disabled={isLoading || isUploadingImage}>
                {isUploadingImage ? 'Uploading...' : (editingDestination ? "Save Changes" : "Add Destination")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}
