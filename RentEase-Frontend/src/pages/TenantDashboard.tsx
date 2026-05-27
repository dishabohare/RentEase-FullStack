import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import PropertyCard from "@/components/PropertyCard";
import { getAllProperties } from "../lib/PropertyApi";
import { getFavorites, removeFavorite } from "../lib/FavoritesApi";
import { getTenantInquiries } from "../lib/InquiryApi";
import { getConversations } from "../lib/MessageApi";
import { getNotifications } from "../lib/NotificationApi";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search, Bookmark, MessageCircle, Send, Sparkles, MapPin, Eye, Bell
} from "lucide-react";
import { toast } from "sonner";

export default function TenantDashboard() {
  const { user, isAuthenticated } = useAuth();
  const userName = user?.name || "Guest";

  const [properties, setProperties] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Recommendation Dialog State
  const [showPromo, setShowPromo] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [recommendedProperty, setRecommendedProperty] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch properties
      const allProps = await getAllProperties();
      const normalizedProps = (allProps || []).map((p: any, idx: number) => {
        let furnishVal = p.furnished;
        if (typeof p.furnished === "boolean") {
          furnishVal = p.furnished ? "Furnished" : "Unfurnished";
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
          id: p.id ?? String(idx),
          location: p.location || [p.address, p.city].filter(Boolean).join(", ") || "No location listed",
          type: p.propertyType || p.type || "Apartment",
          bedrooms: p.bedrooms ?? Number(p.bhk ?? 0),
          bathrooms: p.bathrooms ?? Math.max(1, Number(p.bhk ?? 0) - 1),
          area: p.area ?? Number(p.areaSqFt ?? 0),
          furnished: furnishVal || "Unfurnished",
          image: propImage,
          images: propImages
        };
      });
      setProperties(normalizedProps);

      // Pick one featured property for the recommendation alert popup
      if (normalizedProps.length > 0) {
        setRecommendedProperty(normalizedProps[0]);
      }

      // 2. Fetch wishlist / saved properties
      if (isAuthenticated) {
        const saved = await getFavorites();
        const normalizedSaved = (saved || []).map((p: any, idx: number) => {
          let furnishVal = p.furnished;
          if (typeof p.furnished === "boolean") {
            furnishVal = p.furnished ? "Furnished" : "Unfurnished";
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
            id: p.id ?? String(idx),
            location: p.location || [p.address, p.city].filter(Boolean).join(", ") || "No location listed",
            type: p.propertyType || p.type || "Apartment",
            bedrooms: p.bedrooms ?? Number(p.bhk ?? 0),
            bathrooms: p.bathrooms ?? Math.max(1, Number(p.bhk ?? 0) - 1),
            area: p.area ?? Number(p.areaSqFt ?? 0),
            furnished: furnishVal || "Unfurnished",
            image: propImage,
            images: propImages
          };
        });
        setSavedItems(normalizedSaved);

        // 3. Fetch inquiries count
        const inquiries = await getTenantInquiries();
        setInquiriesCount(inquiries?.length || 0);

        // 4. Fetch messages conversations count
        const convs = await getConversations();
        setConversationsCount(convs?.length || 0);

        // 5. Fetch notifications
        const alerts = await getNotifications();
        setRecentNotifications(alerts?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Dashboard | RentEase";
    fetchDashboardData();

    // Trigger recommended popup after 2 seconds if not dismissed previously
    const dismissed = localStorage.getItem("dismissed_recommendation_popup");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowPromo(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleClosePromo = () => {
    if (dontShowAgain) {
      localStorage.setItem("dismissed_recommendation_popup", "true");
    }
    setShowPromo(false);
  };

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

  const formatTime = (timeStr: any) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " +
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(timeStr);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {userName.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground">Find your perfect rental home today.</p>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Properties Viewed" value={14} icon={Eye} color="primary" />
          <StatCard title="Saved Properties" value={savedItems.length} icon={Bookmark} color="accent" />
          <StatCard title="Inquiries Sent" value={inquiriesCount} icon={Send} color="success" />
          <StatCard title="Inbox Chats" value={conversationsCount} icon={MessageCircle} color="info" />
        </div>

        {/* Recommended */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Loading recommended listings...</p>
          ) : properties.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recommendations available yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.slice(0, 3).map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isSaved={savedItems.some(item => item.id === p.id)}
                  onToggleSave={async () => {
                    const isSaved = savedItems.some(item => item.id === p.id);
                    if (isSaved) {
                      await handleRemoveSave(p.id);
                    } else {
                      try {
                        await getFavorites(); // dummy save check
                        toast.info("Navigate to Explore page to add new items.");
                      } catch {}
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Saved Properties */}
        <div id="saved" className="scroll-mt-20">
          <h2 className="text-lg font-semibold text-foreground mb-4">Saved Properties</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Loading wishlist...</p>
          ) : savedItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">Your saved properties wishlist is currently empty.</p>
              <Button asChild size="sm" className="bg-gradient-hero">
                <Link to="/explore">Explore Listings</Link>
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

        {/* Recent activity */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Activity</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Loading activity history...</p>
          ) : recentNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity logs.</p>
          ) : (
            <div className="space-y-2">
              {recentNotifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 rounded-lg border border-border p-3 ${!n.isRead ? "bg-primary/5" : "bg-card"}`}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatTime(n.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended For You Promo Modal Popup */}
      <Dialog open={showPromo} onOpenChange={(open) => !open && handleClosePromo()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-extrabold">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              Recommended For You!
            </DialogTitle>
          </DialogHeader>
          
          {recommendedProperty && (
            <div className="space-y-4 pt-2">
              <div className="overflow-hidden rounded-xl border border-border aspect-[16/10] relative bg-muted shadow-sm">
                <img 
                  src={recommendedProperty.image} 
                  alt={recommendedProperty.title} 
                  className="h-full w-full object-cover" 
                />
                <Badge className="absolute left-3 top-3 bg-success text-success-foreground border-0">
                  Top Pick
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground line-clamp-1">{recommendedProperty.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> {recommendedProperty.location}
                </p>
              </div>

              <div className="flex justify-between items-center bg-secondary/35 rounded-xl px-4 py-3">
                <div>
                  <span className="text-lg font-extrabold text-primary">₹{recommendedProperty.rent.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <Button size="sm" asChild className="bg-gradient-hero cursor-pointer">
                  <Link to={`/property/${recommendedProperty.id}`}>View Details</Link>
                </Button>
              </div>

              <hr className="border-border" />

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox 
                  id="dont-show-alert" 
                  checked={dontShowAgain}
                  onCheckedChange={(checked) => setDontShowAgain(!!checked)}
                />
                <label 
                  htmlFor="dont-show-alert" 
                  className="text-xs text-muted-foreground font-medium cursor-pointer select-none"
                >
                  Don't show this recommendation again
                </label>
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="ghost" size="sm" onClick={handleClosePromo}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
