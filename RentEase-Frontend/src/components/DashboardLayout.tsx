import { Link, useLocation } from "react-router-dom";
import { type LucideIcon, ChevronLeft, ChevronRight, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  items: NavItem[];
  title: string;
  userName: string;
  userAvatar: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ items, title, userName, userAvatar, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Rent<span className="text-gradient-primary">Ease</span></span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1.5 hover:bg-secondary text-muted-foreground">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <img src={userAvatar} alt={userName} className="h-9 w-9 rounded-full object-cover" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground">{title}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-muted-foreground" asChild>
              <Link to="/"><LogOut className="mr-2 h-4 w-4" />Back to Home</Link>
            </Button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-6">{children}</div>
      </main>
    </div>
  );
}
