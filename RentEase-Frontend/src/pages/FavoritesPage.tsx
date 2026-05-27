import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PropertyCard from "@/components/PropertyCard";
import { getFavorites, removeFavorite } from "../lib/FavoritesApi";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      const normalized = (data || []).map((p: any, index: number) => {
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
      setSavedItems(normalized);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load saved properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Saved Properties | RentEase";
    fetchFavorites();
  }, []);

  const handleRemoveSave = async (propertyId: number | string) => {
    try {
      await removeFavorite(propertyId);
      setSavedItems((prev) => prev.filter((item) => item.id !== propertyId));
      toast.success("Property removed from wishlist");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove property from wishlist");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Wishlist</h1>
          <p className="text-sm text-muted-foreground">Manage your saved rental properties</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="overflow-hidden rounded-xl border border-border bg-card p-4 space-y-4">
                <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-secondary/50" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-secondary/50" />
                  <div className="h-3.5 w-1/2 animate-pulse rounded bg-secondary/50" />
                </div>
              </div>
            ))}
          </div>
        ) : savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-card">
            <Heart className="h-12 w-12 text-muted-foreground/35 mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">Explore listings and save properties you like.</p>
            <Button asChild className="bg-gradient-hero">
              <Link to="/explore"><Search className="mr-2 h-4 w-4" />Discover Properties</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={true}
                onToggleSave={handleRemoveSave}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
