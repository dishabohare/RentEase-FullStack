import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Upload, Eye, Send } from "lucide-react";
import { createProperty } from "../lib/PropertyApi";

const amenitiesList = [
  "WiFi",
  "AC",
  "Power Backup",
  "Lift",
  "Security",
  "Gym",
  "Swimming Pool",
  "Parking",
  "Garden",
  "Clubhouse",
  "Washing Machine",
  "Water Supply",
];

export default function AddPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    locality: "",
    rent: "",
    deposit: "",
    propertyType: "",
    bhk: "",
    areaSqFt: "",
    furnished: "",
    availableFrom: "",
    ownerName: "",
    phone: "",
  });

  const toggleAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        address: `${formData.address}${formData.locality ? `, ${formData.locality}` : ""}`,
        city: formData.city,
        rent: Number(formData.rent),
        propertyType: formData.propertyType,
        bhk: Number(formData.bhk),
        areaSqFt: Number(formData.areaSqFt),
        furnished: formData.furnished === "yes",
      };

      console.log("Sending property payload:", JSON.stringify(payload, null, 2));

      await createProperty(payload);
      setSubmitted(true);

      setFormData({
        title: "",
        description: "",
        address: "",
        city: "",
        locality: "",
        rent: "",
        deposit: "",
        propertyType: "",
        bhk: "",
        areaSqFt: "",
        furnished: "",
        availableFrom: "",
        ownerName: "",
        phone: "",
      });
      setAmenities([]);
    } catch (error) {
      console.error("Error saving property:", error);
      alert("Property save nahi hui. Console me error check karo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex flex-col items-center py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Property Submitted!
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Your property has been saved successfully.
          </p>
          <Button
            className="mt-6 bg-gradient-hero"
            onClick={() => setSubmitted(false)}
          >
            Add Another Property
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          List Your Property
        </h1>
        <p className="mb-8 text-muted-foreground">
          Fill in the details below to list your property on RentEase — it's free!
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">
              Basic Details
            </h2>

            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Sunny 2BHK in Vijay Nagar"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, propertyType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLAT">Apartment / Flat</SelectItem>
                    <SelectItem value="HOUSE">House</SelectItem>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="VILLA">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>BHK</Label>
                <Select
                  value={formData.bhk}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, bhk: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((b) => (
                      <SelectItem key={b} value={String(b)}>
                        {b} BHK
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Location</h2>

            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Street, area, landmark"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g. Indore"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="locality">Area / Locality</Label>
                <Input
                  id="locality"
                  name="locality"
                  placeholder="e.g. Vijay Nagar"
                  value={formData.locality}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">
              Pricing & Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="rent">Monthly Rent (₹)</Label>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  placeholder="25000"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="deposit">Deposit (₹)</Label>
                <Input
                  id="deposit"
                  name="deposit"
                  type="number"
                  placeholder="100000"
                  value={formData.deposit}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="areaSqFt">Area (sqft)</Label>
                <Input
                  id="areaSqFt"
                  name="areaSqFt"
                  type="number"
                  placeholder="1100"
                  value={formData.areaSqFt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Furnished</Label>
                <Select
                  value={formData.furnished}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, furnished: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  name="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {amenitiesList.map((a) => (
                <label
                  key={a}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={amenities.includes(a)}
                    onCheckedChange={() => toggleAmenity(a)}
                  />
                  <span className="text-sm text-foreground">{a}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">
              Description & Images
            </h2>

            <div>
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your property in detail..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Upload Images</Label>
              <div className="mt-2 flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30">
                <div className="text-center">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Image upload backend me abhi connected nahi hai
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Property abhi without image save hogi
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground">
              Contact Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="ownerName">Your Name</Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  placeholder="Full name"
                  value={formData.ownerName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 99999 99999"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Listing
            </Button>

            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-hero hover:opacity-90"
              disabled={loading}
            >
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Submitting..." : "Submit Property"}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}