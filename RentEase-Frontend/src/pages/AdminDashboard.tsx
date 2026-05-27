import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllProperties, updateProperty, deleteProperty } from "../lib/PropertyApi";
import { CheckCircle2, XCircle, Eye, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllProperties();
      const normalized = (data || []).map((p: any, idx: number) => {
        let propImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
        if (p.images && p.images.length > 0) {
          propImage = typeof p.images[0] === 'object' ? p.images[0].imageUrl : p.images[0];
        } else if (p.image) {
          propImage = p.image;
        }

        return {
          ...p,
          id: p.id ?? String(idx),
          title: p.title ?? "Untitled Property",
          location: p.location || [p.address, p.city].filter(Boolean).join(", ") || "No location listed",
          ownerName: p.owner?.name || p.ownerName || "Rahul Sharma",
          rent: Number(p.rent ?? 0),
          image: propImage,
          verified: p.verified ?? false
        };
      });
      setPropertiesList(normalized);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Failed to load listings for verification.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Admin Panel | RentEase";
    fetchProperties();
  }, []);

  const pending = propertiesList.filter((p) => !p.verified);
  const approved = propertiesList.filter((p) => p.verified);

  const handleApprove = async (id: number | string, originalProp: any) => {
    try {
      const payload = {
        title: originalProp.title,
        description: originalProp.description,
        address: originalProp.address,
        city: originalProp.city,
        rent: Number(originalProp.rent),
        propertyType: originalProp.propertyType || originalProp.type || "FLAT",
        bhk: Number(originalProp.bhk),
        areaSqFt: Number(originalProp.areaSqFt || originalProp.area),
        furnished: originalProp.furnished === true || originalProp.furnished === "yes" || originalProp.furnished === "Furnished",
        verified: true
      };

      await updateProperty(id, payload);
      toast.success(`Property approved successfully`, {
        description: `"${originalProp.title}" has been verified and listed.`,
      });
      fetchProperties();
    } catch (error) {
      console.error("Failed to approve property:", error);
      toast.error("Failed to approve listing.");
    }
  };

  const handleReject = async (id: number | string, originalProp: any) => {
    try {
      await deleteProperty(id);
      toast.info(`Property rejected`, {
        description: `"${originalProp.title}" was removed from the review queue.`,
      });
      fetchProperties();
    } catch (error) {
      console.error("Failed to reject property:", error);
      toast.error("Failed to remove listing.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <Badge className="mb-2 bg-destructive/10 text-destructive border-0">Admin</Badge>
          <h1 className="text-2xl font-bold text-foreground">Verification Dashboard</h1>
          <p className="text-muted-foreground">Review and verify property listings</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { label: "Pending Review", value: pending.length, icon: AlertTriangle, color: "bg-warning/10 text-warning" },
            { label: "Approved", value: approved.length, icon: CheckCircle2, color: "bg-success/10 text-success" },
            { label: "Flagged", value: 1, icon: Shield, color: "bg-destructive/10 text-destructive" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Pending Verifications</h2>
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl bg-card">
            <CheckCircle2 className="h-10 w-10 text-success/60 mb-2" />
            <h3 className="text-base font-semibold text-foreground">All caught up!</h3>
            <p className="text-sm text-muted-foreground">No property listings are currently pending verification.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
                <img src={p.image} alt={p.title} className="h-16 w-24 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.ownerName} • {p.location}</p>
                  <p className="text-sm font-semibold text-primary">₹{p.rent.toLocaleString()}/mo</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Eye className="mr-1 h-3.5 w-3.5" />Review</Button>
                  <Button size="sm" onClick={() => handleApprove(p.id, p)} className="bg-success text-success-foreground hover:bg-success/90">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />Approve
                  </Button>
                  <Button size="sm" onClick={() => handleReject(p.id, p)} variant="destructive">
                    <XCircle className="mr-1 h-3.5 w-3.5" />Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KYC placeholder */}
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-8 text-center">
          <Shield className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">KYC Verification</h3>
          <p className="text-sm text-muted-foreground">Identity verification module coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
