import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getNotifications, markAllNotificationsRead, markNotificationRead, clearAllNotifications } from "../lib/NotificationApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Inbox, CheckCircle2, Heart, MessageCircle, Calendar, Trash2, CheckCheck } from "lucide-react";
import { toast } from "sonner";

const typeIcons = {
  inquiry: Inbox,
  approved: CheckCircle2,
  saved: Heart,
  message: MessageCircle,
  reminder: Calendar,
};

const typeColors = {
  inquiry: "bg-accent/10 text-accent",
  approved: "bg-success/10 text-success",
  saved: "bg-destructive/10 text-destructive",
  message: "bg-info/10 text-info",
  reminder: "bg-primary/10 text-primary",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotificationsList = async () => {
    try {
      const data = await getNotifications();
      // Map database's isRead field to read for the local UI code compatibility
      const mapped = (data || []).map((n: any) => ({
        ...n,
        read: n.read ?? n.isRead ?? false
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Notifications | RentEase";
    fetchNotificationsList();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      toast.info("All notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const handleMarkSingleRead = async (id: number | string) => {
    // Find current notification
    const item = notifications.find((n) => n.id === id);
    if (!item || item.read) return; // already read or missing

    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification read:", error);
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <Badge variant="secondary">{unreadCount} unread</Badge>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleClearAll}>
                <Trash2 className="mr-1.5 h-4 w-4" /> Clear all
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground animate-pulse">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-card">
            <Inbox className="h-12 w-12 text-muted-foreground/35 mb-3" />
            <h3 className="text-lg font-semibold text-foreground">No new notifications</h3>
            <p className="text-sm text-muted-foreground">We'll let you know when something important happens.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = (typeIcons as any)[n.type] || Inbox;
              return (
                <div 
                  key={n.id} 
                  onClick={() => handleMarkSingleRead(n.id)}
                  className={`flex items-start gap-3 rounded-xl border border-border p-4 transition-all hover:shadow-card cursor-pointer ${
                    !n.read ? "bg-primary/5 border-primary/20" : "bg-card"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${(typeColors as any)[n.type] || "bg-secondary text-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{formatTime(n.timestamp)}</p>
                  </div>
                  {!n.read && <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-2" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
