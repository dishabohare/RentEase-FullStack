import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockTenantUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = user?.name || mockTenantUser.name;
  const displayEmail = user?.email || mockTenantUser.email;
  const displayPhone = user?.phone || mockTenantUser.phone;
  const displayRole = user?.role ? user.role.toLowerCase() : mockTenantUser.role;

  const [name, setName] = useState(displayName);
  const [email, setEmail] = useState(displayEmail);
  const [phone, setPhone] = useState(displayPhone || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    document.title = "Profile | RentEase";
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdatingProfile(true);
    // Simulate updating name/phone
    setTimeout(() => {
      setIsUpdatingProfile(false);
      const updatedUser = {
        ...user,
        name,
        email,
        phone,
      };
      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
    }, 800);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 1. File Type Validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    // 2. File Size Validation (2MB Limit)
    const limitBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > limitBytes) {
      toast.error("File is too large. Max size is 2MB.");
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    
    reader.onload = async () => {
      const base64String = reader.result as string;
      try {
        const response = await api.put(`/api/users/${user.id}/avatar`, {
          avatar: base64String
        });
        
        if (response.data) {
          // Sync context and local storage with updated user
          const updatedUser = {
            ...user,
            avatar: base64String
          };
          updateUser(updatedUser);
          toast.success("Profile picture updated!");
        }
      } catch (error) {
        console.error("Avatar upload failed:", error);
        toast.error("Failed to upload avatar image to database.");
      } finally {
        setIsUploadingImage(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read image file.");
      setIsUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          {/* Hidden Image Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Avatar Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              {isUploadingImage ? (
                <div className="h-20 w-20 rounded-full flex items-center justify-center bg-secondary border border-border">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={name} 
                  className="h-20 w-20 rounded-full object-cover border-2 border-border" 
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl uppercase border-2 border-border">
                  {getInitials(name)}
                </div>
              )}
              <button 
                type="button" 
                onClick={triggerFileInput}
                disabled={isUploadingImage}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                title="Upload Profile Picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="capitalize px-2.5 py-0.5">{displayRole}</Badge>
                <Badge className="bg-success/10 text-success border-0 gap-1 px-2.5 py-0.5">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </Badge>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleUpdateProfile}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  disabled
                  className="bg-secondary/35 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <div>
                <Label>Account Role</Label>
                <Input 
                  value={displayRole} 
                  disabled 
                  className="capitalize bg-secondary/35 cursor-not-allowed" 
                />
              </div>
            </div>
            <Button type="submit" className="bg-gradient-hero hover:opacity-90 min-w-[140px]" disabled={isUpdatingProfile}>
              <Save className="mr-2 h-4 w-4" />
              {isUpdatingProfile ? "Saving..." : "Update Profile"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
