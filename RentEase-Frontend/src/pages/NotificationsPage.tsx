import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notifications } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Bell, Inbox, CheckCircle2, Heart, MessageCircle, Calendar } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <Badge variant="secondary">{notifications.filter((n) => !n.read).length} unread</Badge>
        </div>
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type];
            return (
              <div key={n.id} className={`flex items-start gap-3 rounded-xl border border-border p-4 transition-all hover:shadow-card ${!n.read ? "bg-primary/5" : "bg-card"}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeColors[n.type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.timestamp}</p>
                </div>
                {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
