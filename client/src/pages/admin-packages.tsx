import React, { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Dummy data for demonstration
const initialPackages = [
  { id: 1, name: "Beach Paradise", description: "Enjoy the sun and sand.", price: 12000 },
  { id: 2, name: "Mountain Adventure", description: "Explore the mountains.", price: 15000 },
];

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState(initialPackages);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [isAdding, setIsAdding] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new package
  const handleAdd = () => {
    setPackages([
      ...packages,
      { id: Date.now(), name: form.name, description: form.description, price: Number(form.price) },
    ]);
    setForm({ name: "", description: "", price: "" });
    setIsAdding(false);
  };

  // Edit package
  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setForm({ name: pkg.name, description: pkg.description, price: String(pkg.price) });
  };

  // Update package
  const handleUpdate = () => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === editingId ? { ...pkg, ...form, price: Number(form.price) } : pkg
      )
    );
    setEditingId(null);
    setForm({ name: "", description: "", price: "" });
  };

  // Delete package
  const handleDelete = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Manage Packages</h1>

          {/* Add/Edit Form */}
          {(isAdding || editingId !== null) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Package" : "Add New Package"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Package Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <Textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                  />
                  <Input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                  />
                  <div className="flex gap-2">
                    <Button onClick={editingId ? handleUpdate : handleAdd}>
                      {editingId ? "Update" : "Add"}
                    </Button>
                    <Button variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); setForm({ name: "", description: "", price: "" }); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Button */}
          {!isAdding && editingId === null && (
            <div className="mb-6 text-right">
              <Button onClick={() => setIsAdding(true)}>Add Package</Button>
            </div>
          )}

          {/* Packages List */}
          <div className="space-y-4">
            {packages.length === 0 ? (
              <div className="text-center text-gray-500">No packages found.</div>
            ) : (
              packages.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{pkg.name}</span>
                      <span className="text-lg font-bold text-green-700">₱{pkg.price.toLocaleString()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-gray-700">{pkg.description}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(pkg.id)}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
