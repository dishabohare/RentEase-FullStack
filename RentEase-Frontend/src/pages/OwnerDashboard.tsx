import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { properties, mockOwnerUser, notifications } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Home, PlusCircle, MessageCircle, Bell,
  User, Building2, Eye, CheckCircle2, Clock, Inbox,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/owner-dashboard", icon: LayoutDashboard },
  { label: "My Properties", to: "/owner-dashboard", icon: Building2 },
  { label: "Add Property", to: "/add-property", icon: PlusCircle },
  { label: "Inquiries", to: "/owner-dashboard", icon: Inbox },
  { label: "Messages", to: "/messages", icon: MessageCircle },
  { label: "Profile", to: "/profile", icon: User },
];

const ownerProperties = properties.slice(0, 4);

export default function OwnerDashboard() {
  return (
    <DashboardLayout items={navItems} title="Owner" userName={mockOwnerUser.name} userAvatar={mockOwnerUser.avatar}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and tenant inquiries</p>
          </div>
          <Button asChild className="bg-gradient-hero hover:opacity-90">
            <Link to="/add-property"><PlusCircle className="mr-2 h-4 w-4" />Add Property</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Properties" value={4} icon={Building2} color="primary" />
          <StatCard title="Active Listings" value={3} icon={CheckCircle2} color="success" trend="+1 this week" />
          <StatCard title="Inquiries" value={12} icon={Inbox} color="accent" trend="+3 today" />
          <StatCard title="Pending Verification" value={1} icon={Clock} color="info" />
        </div>

        {/* My Listings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">My Properties</h2>
          <div className="space-y-3">
            {ownerProperties.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated">
                <img src={p.image} alt={p.title} className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">{p.title}</h3>
                    {p.verified ? (
                      <Badge className="bg-success/10 text-success border-0 text-xs shrink-0">Verified</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs shrink-0">Pending</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.location}</p>
                  <p className="text-sm font-semibold text-primary mt-1">₹{p.rent.toLocaleString()}/mo</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> 45</span>
                  <span className="flex items-center gap-1"><Inbox className="h-3.5 w-3.5" /> 3</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/property/${p.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Inquiries</h2>
          <div className="space-y-3">
            {[
              { name: "Ananya K.", property: "2BHK in Koramangala", time: "2 hours ago", msg: "Hi, is this still available?" },
              { name: "Ravi S.", property: "3BHK in Whitefield", time: "5 hours ago", msg: "Can I schedule a visit this weekend?" },
              { name: "Meera P.", property: "1BHK in Indiranagar", time: "Yesterday", msg: "What's the minimum lease duration?" },
            ].map((inq, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                  {inq.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{inq.name}</p>
                    <span className="text-xs text-muted-foreground">{inq.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Re: {inq.property}</p>
                  <p className="text-sm text-foreground mt-1">"{inq.msg}"</p>
                </div>
                <Button size="sm" variant="outline">Reply</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Notifications</h2>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 rounded-lg border border-border p-3 ${!n.read ? "bg-primary/5" : "bg-card"}`}>
                <Bell className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
