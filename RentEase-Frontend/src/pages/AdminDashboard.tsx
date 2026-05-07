import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { properties } from "@/data/mockData";
import { CheckCircle2, XCircle, Eye, Shield, AlertTriangle } from "lucide-react";

const pending = properties.filter((p) => !p.verified);
const approved = properties.filter((p) => p.verified);

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="mb-8">
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
                <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90"><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Approve</Button>
                <Button size="sm" variant="destructive"><XCircle className="mr-1 h-3.5 w-3.5" />Reject</Button>
              </div>
            </div>
          ))}
        </div>

        {/* KYC placeholder */}
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-8 text-center">
          <Shield className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">KYC Verification</h3>
          <p className="text-sm text-muted-foreground">Identity verification module coming soon</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
