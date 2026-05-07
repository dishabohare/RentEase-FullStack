import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockTenantUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const [user] = useState(mockTenantUser);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">My Profile</h1>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                {user.verified && (
                  <Badge className="bg-success/10 text-success border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Verified</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Full Name</Label><Input defaultValue={user.name} /></div>
              <div><Label>Email</Label><Input defaultValue={user.email} type="email" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Phone</Label><Input defaultValue={user.phone} type="tel" /></div>
              <div><Label>Role</Label><Input defaultValue={user.role} disabled className="capitalize" /></div>
            </div>
            <Button className="bg-gradient-hero hover:opacity-90">
              <Save className="mr-2 h-4 w-4" />Update Profile
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
