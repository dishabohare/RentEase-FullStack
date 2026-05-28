import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  CheckCircle2,
  Clock,
  Inbox,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { getPropertiesByOwner, updateProperty, deleteProperty } from "../lib/PropertyApi";
import { getOwnerInquiries } from "../lib/InquiryApi";
import { toast } from "sonner";


export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || "Guest";
  const [properties, setProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<any>(null);
const analyticsData = [
  {
    name: "Views",
    value: properties.length * 120,
  },
  {
    name: "Favorites",
    value: properties.length * 35,
  },
  {
    name: "Inquiries",
    value: inquiries.length,
  },
  {
    name: "Conversions",
    value: Math.floor(inquiries.length / 2),
  },
];
  // Edit Modal State
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    rent: "",
    propertyType: "",
    bhk: "",
    areaSqFt: "",
    furnished: "yes",
  });

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const props = await getPropertiesByOwner(user.id);
      setProperties(props || []);
      
      const inqs = await getOwnerInquiries();
      setInquiries(inqs || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Dashboard | RentEase";
    fetchDashboardData();
  }, [user]);

  const handleEditClick = (p: any) => {
    setEditingProperty(p);
    setEditFormData({
      title: p.title || "",
      description: p.description || "",
      address: p.address || "",
      city: p.city || "",
      rent: String(p.rent || ""),
      propertyType: p.propertyType || "FLAT",
      bhk: String(p.bhk || "1"),
      areaSqFt: String(p.areaSqFt || ""),
      furnished: p.furnished === true || p.furnished === "yes" ? "yes" : "no",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    try {
      const payload = {
        title: editFormData.title,
        description: editFormData.description,
        address: editFormData.address,
        city: editFormData.city,
        rent: Number(editFormData.rent),
        propertyType: editFormData.propertyType,
        bhk: Number(editFormData.bhk),
        areaSqFt: Number(editFormData.areaSqFt),
        furnished: editFormData.furnished === "yes",
      };

      const updated = await updateProperty(editingProperty.id, payload);
      if (updated) {
        toast.success("Property updated successfully!");
        setEditingProperty(null);
        fetchDashboardData(); // Refresh properties list
      }
    } catch (error) {
      console.error("Failed to update property:", error);
      toast.error("Failed to update property details.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteProperty(deleteTargetId);
      toast.success("Property deleted successfully!");
      setProperties((prev) => prev.filter((p) => p.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast.error("Failed to delete property.");
    }
  };

  const totalProperties = properties.length;
  const verifiedProperties = properties.filter((p) => p.verified === true).length;
  const pendingProperties = totalProperties - verifiedProperties;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {userName.split(" ")[0]}! 👋</h1>
            <p className="text-muted-foreground">Manage your properties and tenant inquiries</p>
          </div>
          <Button asChild className="bg-gradient-hero hover:opacity-90 cursor-pointer">
            <Link to="/add-property"><PlusCircle className="mr-2 h-4 w-4" />Add Property</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Properties" value={totalProperties} icon={Building2} color="primary" />
          <StatCard title="Active Listings" value={verifiedProperties} icon={CheckCircle2} color="success" />
          <StatCard title="Inquiries" value={inquiries.length} icon={Inbox} color="accent" />
          <StatCard title="Pending Verification" value={pendingProperties} icon={Clock} color="info" />
        </div>

        {/* My Properties List */}
        <div id="properties" className="scroll-mt-20">
          <h2 className="text-lg font-semibold text-foreground mb-4">My Listed Properties</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 animate-pulse">
                  <div className="h-20 w-28 rounded-lg bg-secondary/60 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-secondary/60 rounded" />
                    <div className="h-3 w-1/4 bg-secondary/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-card text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/35 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No properties listed yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Start earning by listing your apartment, house, or villa.</p>
              <Button asChild className="bg-gradient-hero cursor-pointer">
                <Link to="/add-property"><PlusCircle className="mr-2 h-4 w-4" />List Your First Property</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((p) => {
                const propImg = (p.images && p.images.length > 0)
                  ? (typeof p.images[0] === 'object' ? p.images[0].imageUrl : p.images[0])
                  : (p.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80");
                return (
                  <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-all duration-200">
                    <img 
                      src={propImg} 
                      alt={p.title} 
                      className="h-20 w-28 shrink-0 rounded-lg object-cover bg-muted" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">{p.title}</h3>
                        {p.verified ? (
                          <Badge className="bg-success/10 text-success border-0 text-xs shrink-0 px-2 py-0.5">Verified</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs shrink-0 px-2 py-0.5">Pending Review</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.address}, {p.city}</p>
                      <p className="text-sm font-semibold text-primary mt-1">₹{Number(p.rent || 0).toLocaleString()}/mo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(p)} title="Edit Details" className="cursor-pointer">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(p.id)} title="Delete Listing" className="text-destructive hover:bg-destructive/10 cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this property listing from RentEase. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteTargetId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete Property
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                        <Link to={`/property/${p.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Analytics Dashboard */}
<div className="mb-8 grid gap-6 lg:grid-cols-2">

  <div className="rounded-2xl border bg-card p-6 shadow-sm">

    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">
          Analytics Overview
        </h2>

        <p className="text-sm text-muted-foreground">
          Performance of your listings
        </p>
      </div>

      <Badge variant="secondary">
        Live Stats
      </Badge>
    </div>

    <div className="h-[300px]">

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={analyticsData}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>

  </div>

  <div className="grid gap-4 sm:grid-cols-2">

    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">
        Total Views
      </p>

      <h2 className="mt-2 text-4xl font-extrabold">
        {properties.length * 120}
      </h2>
    </div>

    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">
        Favorites
      </p>

      <h2 className="mt-2 text-4xl font-extrabold">
        {properties.length * 35}
      </h2>
    </div>

    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">
        Total Inquiries
      </p>

      <h2 className="mt-2 text-4xl font-extrabold">
        {inquiries.length}
      </h2>
    </div>

    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">
        Conversion Rate
      </p>

      <h2 className="mt-2 text-4xl font-extrabold">
        {inquiries.length > 0
          ? `${Math.floor(
              (inquiries.length / (properties.length * 10 || 1)) * 100
            )}%`
          : "0%"}
      </h2>
    </div>

  </div>

</div>

        {/* Recent Inquiries Panel */}
        <div id="inquiries" className="scroll-mt-20">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Inquiries</h2>
          {inquiries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">No inquiries received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => {
                const tenantName = inq.user?.name || "Tenant";
                const propTitle = inq.property?.title || "Property";
                const firstLetter = tenantName[0].toUpperCase();
                return (
                  <div key={inq.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                      {firstLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{tenantName}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(inq.timestamp).toLocaleDateString() + " " + new Date(inq.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Re: {propTitle}</p>
                      <p className="text-sm text-foreground mt-1">"{inq.message}"</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Visit Date: {inq.visitDate} | Phone: {inq.phone}</p>
                    </div>
                    <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => navigate("/messages")}>Reply</Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Property Dialog Modal */}
      <Dialog open={editingProperty !== null} onOpenChange={(open) => !open && setEditingProperty(null)}>
        <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Property Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={editFormData.title} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))} 
                required 
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Property Type</Label>
                <Select
                  value={editFormData.propertyType}
                  onValueChange={(val) => setEditFormData(prev => ({ ...prev, propertyType: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLAT">Flat / Apartment</SelectItem>
                    <SelectItem value="HOUSE">House</SelectItem>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="VILLA">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>BHK</Label>
                <Select
                  value={editFormData.bhk}
                  onValueChange={(val) => setEditFormData(prev => ({ ...prev, bhk: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5"].map((b) => (
                      <SelectItem key={b} value={b}>{b} BHK</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-rent">Monthly Rent (₹)</Label>
                <Input 
                  id="edit-rent" 
                  type="number" 
                  value={editFormData.rent} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, rent: e.target.value }))} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-area">Area (sqft)</Label>
                <Input 
                  id="edit-area" 
                  type="number" 
                  value={editFormData.areaSqFt} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, areaSqFt: e.target.value }))} 
                  required 
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-city">City</Label>
                <Input 
                  id="edit-city" 
                  value={editFormData.city} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))} 
                  required 
                />
              </div>
              
              <div>
                <Label>Furnished</Label>
                <Select
                  value={editFormData.furnished}
                  onValueChange={(val) => setEditFormData(prev => ({ ...prev, furnished: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-address">Full Address</Label>
              <Input 
                id="edit-address" 
                value={editFormData.address} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))} 
                required 
              />
            </div>

            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea 
                id="edit-desc" 
                value={editFormData.description} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))} 
                rows={3} 
                required 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingProperty(null)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-hero hover:opacity-90">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
