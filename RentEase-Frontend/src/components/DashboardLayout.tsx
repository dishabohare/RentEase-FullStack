import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  type LucideIcon, ChevronLeft, ChevronRight, LogOut, Home, 
  LayoutDashboard, Search, Heart, MessageCircle, Bell, 
  User, Building2, PlusCircle, Inbox, Shield, Menu, 
  Settings, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications } from "../lib/NotificationApi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchHeaderNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error("Error loading header notifications:", error);
      }
    };
    if (user) {
      fetchHeaderNotifications();
    }
  }, [location.pathname, user]);

  // Handle smooth scroll on hash change
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        // Wait briefly for content rendering
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash, location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Dynamic Page Title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/tenant-dashboard":
        return "Tenant Dashboard";
      case "/owner-dashboard":
        return "Owner Dashboard";
      case "/admin":
        return "Admin Dashboard";
      case "/messages":
        return "Messages";
      case "/notifications":
        return "Notifications";
      case "/profile":
        return "Profile Settings";
      case "/add-property":
        return "List New Property";
      case "/favorites":
        return "Saved Wishlist";
      case "/settings":
        return "Account Settings";
      case "/help-support":
        return "Help & Support";
      default:
        return "Dashboard";
    }
  };

  const getNavItems = () => {
    if (!user) return [];
    
    const role = user.role.toUpperCase();
    if (role === "TENANT") {
      return [
        { label: "Dashboard", to: "/tenant-dashboard", icon: LayoutDashboard },
        { label: "Browse Properties", to: "/explore", icon: Search },
        { label: "Saved Properties", to: "/favorites", icon: Heart },
        { label: "Messages", to: "/messages", icon: MessageCircle },
        { label: "Notifications", to: "/notifications", icon: Bell },
        { label: "Profile", to: "/profile", icon: User },
        { label: "Settings", to: "/settings", icon: Settings },
        { label: "Help & Support", to: "/help-support", icon: HelpCircle },
      ];
    } else if (role === "OWNER") {
      return [
        { label: "Dashboard", to: "/owner-dashboard", icon: LayoutDashboard },
        { label: "My Properties", to: "/owner-dashboard#properties", icon: Building2 },
        { label: "Add Property", to: "/add-property", icon: PlusCircle },
        { label: "Inquiries", to: "/owner-dashboard#inquiries", icon: Inbox },
        { label: "Messages", to: "/messages", icon: MessageCircle },
        { label: "Profile", to: "/profile", icon: User },
        { label: "Settings", to: "/settings", icon: Settings },
        { label: "Help & Support", to: "/help-support", icon: HelpCircle },
      ];
    } else if (role === "ADMIN") {
      return [
        { label: "Dashboard", to: "/admin", icon: Shield },
        { label: "Messages", to: "/messages", icon: MessageCircle },
        { label: "Notifications", to: "/notifications", icon: Bell },
        { label: "Profile", to: "/profile", icon: User },
        { label: "Settings", to: "/settings", icon: Settings },
        { label: "Help & Support", to: "/help-support", icon: HelpCircle },
      ];
    }
    return [];
  };

  const navItems = getNavItems();
  const userName = user?.name || "Guest User";
  const roleLabel = user?.role === "OWNER" ? "Property Owner" : user?.role === "ADMIN" ? "Admin" : "Tenant";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const unreadCount = notifications.filter(n => !(n.read ?? n.isRead)).length;

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Rent<span className="text-gradient-primary">Ease</span></span>
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="hidden md:flex rounded-md p-1.5 hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to.split("#")[0] && (!item.to.includes("#") || location.hash === item.to.substring(item.to.indexOf("#")));
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {(!collapsed || mobileOpen) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-2">
        <div className={`flex items-center gap-3 ${collapsed && !mobileOpen ? "justify-center" : ""}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt={userName} className="h-9 w-9 rounded-full object-cover border border-border" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase border border-border">
              {getInitials(userName)}
            </div>
          )}
          {(!collapsed || mobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none mb-1 text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground truncate leading-none">{roleLabel}</p>
            </div>
          )}
        </div>
        
        {(!collapsed || mobileOpen) ? (
          <div className="space-y-1 pt-2">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground cursor-pointer" asChild>
              <Link to="/"><Home className="mr-2 h-4 w-4" />Home Website</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />Log Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 items-center pt-2">
            <Link to="/" title="Home Website" className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary">
              <Home className="h-4 w-4" />
            </Link>
            <button onClick={handleLogout} title="Log Out" className="p-2 text-destructive hover:bg-destructive/10 rounded-md cursor-pointer">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block sticky top-0 h-screen border-r border-border transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/85 backdrop-blur-lg px-4 md:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden rounded-md p-2 hover:bg-secondary text-muted-foreground cursor-pointer" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r border-border">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <h1 className="text-lg md:text-xl font-bold text-foreground truncate">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Notification Bell */}
            <Link to="/notifications" className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={userName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-xs uppercase border border-border">
                      {getInitials(userName)}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full flex items-center">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="cursor-pointer w-full flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" /> Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="cursor-pointer w-full flex items-center">
                    <Bell className="mr-2 h-4 w-4" /> Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Main Content Panel */}
        <main className="flex-1 overflow-auto bg-gradient-subtle/30">
          <div className="container max-w-6xl p-4 md:p-8 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
