import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import PropertyCard from "@/components/PropertyCard";
import { properties, mockTenantUser, notifications } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Search, Heart, MessageCircle, Bell,
  User, Home, Bookmark, Eye, Send,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/tenant-dashboard", icon: LayoutDashboard },
  { label: "Browse Properties", to: "/explore", icon: Search },
  { label: "Saved", to: "/tenant-dashboard", icon: Heart },
  { label: "Messages", to: "/messages", icon: MessageCircle },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Profile", to: "/profile", icon: User },
];

export default function TenantDashboard() {
  return (
    <DashboardLayout items={navItems} title="Tenant" userName={mockTenantUser.name} userAvatar={mockTenantUser.avatar}>
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {mockTenantUser.name.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground">Find your perfect rental home today.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by location, property type..." className="pl-10" />
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Properties Viewed" value={24} icon={Eye} color="primary" />
          <StatCard title="Saved Properties" value={6} icon={Bookmark} color="accent" />
          <StatCard title="Inquiries Sent" value={4} icon={Send} color="success" />
          <StatCard title="Messages" value={3} icon={MessageCircle} color="info" />
        </div>

        {/* Filter chips */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Quick Filters</h2>
          <div className="flex flex-wrap gap-2">
            {["All", "1 BHK", "2 BHK", "3 BHK", "Furnished", "Under ₹20K", "Verified"].map((c) => (
              <Badge key={c} variant="secondary" className="cursor-pointer px-3 py-1.5 hover:bg-primary/10 hover:text-primary transition-colors">{c}</Badge>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.slice(0, 3).map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>

        {/* Saved Properties */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Saved Properties</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.slice(2, 4).map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>

        {/* Recent notifications */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 rounded-lg border border-border p-3 ${!n.read ? "bg-primary/5" : "bg-card"}`}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
