import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { KeyRound, BellRing, UserCheck, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Settings | RentEase";
  }, []);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const handleSavePreferences = () => {
    toast.success("Notification preferences updated!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-sm text-muted-foreground">Manage details and notification settings</p>
        </div>

        {/* Change Password Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Change Password</h2>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="old-pw">Current Password</Label>
              <Input 
                id="old-pw" 
                type="password" 
                placeholder="••••••••" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="new-pw">New Password</Label>
                <Input 
                  id="new-pw" 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  minLength={6}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-pw">Confirm New Password</Label>
                <Input 
                  id="confirm-pw" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="bg-gradient-hero hover:opacity-90">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Preferences Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <BellRing className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive weekly recommendations and new messages in your inbox.</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">SMS Alerts</p>
                <p className="text-xs text-muted-foreground">Receive urgent text notifications about your site inquiries.</p>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>
            
            <Button onClick={handleSavePreferences} variant="secondary">
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-destructive/10 pb-3 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="text-base font-bold">Danger Zone</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your profile and all your listings. This action is irreversible.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => toast.error("Account deletion can only be requested via admin support.")}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
