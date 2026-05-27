import { useEffect, useMemo, useState } from "react";
import { getAllProperties } from "../lib/PropertyApi";
import { getFavoriteIds, addFavorite, removeFavorite } from "../lib/FavoritesApi";
import { useAuth } from "../context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";

const propertyTypes = ["All", "FLAT", "HOUSE", "PG", "VILLA"];
const bhkOptions = ["Any", "1", "2", "3", "4+"];
const furnishOptions = ["All", "yes", "no"];

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [bhk, setBhk] = useState("Any");
  const [furnish, setFurnish] = useState("All");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Explore Rentals | RentEase";
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        console.log("Explore Properties:", data);
        setProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load rental listings from server.");
      }
    };

    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      try {
        const ids = await getFavoriteIds();
        setSavedIds(ids || []);
      } catch (error) {
        console.error("Error fetching saved property IDs:", error);
      }
    };

    fetchProperties();
    fetchFavorites();
  }, [isAuthenticated]);

  const handleToggleSave = async (propertyId: number | string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to save properties.");
      return;
    }
    const id = Number(propertyId);
    const isAlreadySaved = savedIds.includes(id);

    try {
      if (isAlreadySaved) {
        await removeFavorite(id);
        setSavedIds((prev) => prev.filter((item) => item !== id));
        toast.success("Property removed from wishlist");
      } else {
        await addFavorite(id);
        setSavedIds((prev) => [...prev, id]);
        toast.success("Property saved to wishlist");
      }
    } catch (error) {
      console.error("Error updating saved status:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const normalizedProperties = useMemo(() => {
    return properties.map((p, index) => {
      const bedrooms = p.bedrooms ?? Number(p.bhk ?? 0);
      const bathrooms = p.bathrooms ?? Math.max(1, Number(p.bhk ?? 0) - 1);
      const area = p.area ?? Number(p.areaSqFt ?? 0);
      
      let furnishVal = p.furnished;
      if (typeof p.furnished === "boolean") {
        furnishVal = p.furnished ? "Furnished" : "Unfurnished";
      } else if (p.furnished === "yes") {
        furnishVal = "Furnished";
      } else if (p.furnished === "no") {
        furnishVal = "Unfurnished";
      }

      let propImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
      let propImages = [propImage];
      
      if (p.images && p.images.length > 0) {
        propImages = p.images.map((img: any) => typeof img === 'object' ? img.imageUrl : img);
        propImage = propImages[0];
      } else if (p.image) {
        propImage = p.image;
        propImages = [p.image];
      }

      return {
        ...p,
        id: p.id ?? String(index),
        title: p.title ?? "Untitled Property",
        location: p.location || [p.address, p.city].filter(Boolean).join(", ") || "No location listed",
        type: p.type || p.propertyType || "Apartment",
        bhk: Number(p.bhk ?? 0),
        bedrooms,
        bathrooms,
        area,
        furnished: furnishVal || "Unfurnished",
        rent: Number(p.rent ?? 0),
        verified: p.verified ?? false,
        image: propImage,
        images: propImages
      };
    });
  }, [properties]);

  const filtered = useMemo(() => {
    let list = [...normalizedProperties];

    if (search) {
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.location || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type !== "All") {
      list = list.filter((p) => String(p.type).toUpperCase() === type.toUpperCase());
    }

    if (bhk !== "Any") {
      list = list.filter((p) =>
        bhk === "4+" ? Number(p.bhk) >= 4 : Number(p.bhk) === Number(bhk)
      );
    }

    if (furnish !== "All") {
      const matchVal = furnish === "yes" ? "Furnished" : "Unfurnished";
      list = list.filter((p) => p.furnished === matchVal);
    }

    if (sort === "price-low") {
      list.sort((a, b) => Number(a.rent) - Number(b.rent));
    } else if (sort === "price-high") {
      list.sort((a, b) => Number(b.rent) - Number(a.rent));
    }

    return list;
  }, [normalizedProperties, search, type, bhk, furnish, sort]);

  const activeFilters = [
    type !== "All" && type,
    bhk !== "Any" && `${bhk} BHK`,
    furnish !== "All" && (furnish === "yes" ? "Furnished" : "Unfurnished"),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Explore Properties
          </h1>
          <p className="mt-1 text-muted-foreground">
            Browse {normalizedProperties.length}+ rental listings
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by city, address, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" />
              Filters
            </Button>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low → High</SelectItem>
                <SelectItem value="price-high">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-card animate-fade-in">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Property Type
                </label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="FLAT">Apartment / Flat</SelectItem>
                    <SelectItem value="HOUSE">House</SelectItem>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="VILLA">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  BHK
                </label>
                <Select value={bhk} onValueChange={setBhk}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bhkOptions.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b === "Any" ? "Any BHK" : `${b} BHK`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Furnishing
                </label>
                <Select value={furnish} onValueChange={setFurnish}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="yes">Furnished</SelectItem>
                    <SelectItem value="no">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <Badge key={f as string} variant="secondary" className="gap-1">
                {f as string}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    if (f === type) setType("All");
                    if ((f as string).includes("BHK")) setBhk("Any");
                    if (f === "Furnished" || f === "Unfurnished") setFurnish("All");
                  }}
                />
              </Badge>
            ))}
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => {
                setType("All");
                setBhk("Any");
                setFurnish("All");
              }}
            >
              Clear all
            </button>
          </div>
        )}

        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length} properties found
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={savedIds.includes(Number(p.id))}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold text-foreground">
              No properties found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or add a new property
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}