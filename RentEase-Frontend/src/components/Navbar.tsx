import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, PlusCircle, Info, Phone, Menu, X, LogIn, UserPlus, User, LogOut, Bell, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Explore", to: "/explore", icon: Search },
  { label: "Post Property", to: "/add-property", icon: PlusCircle },
  { label: "How It Works", to: "/#how-it-works", icon: Info },
  { label: "About", to: "/about", icon: Info },
  { label: "Contact", to: "/contact", icon: Phone },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const getDashboardUrl = () => {
    if (!user) return "/login";
    if (user.role === "OWNER") return "/owner-dashboard";
    if (user.role === "ADMIN") return "/admin";
    return "/tenant-dashboard";
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Rent<span className="text-gradient-primary">Ease</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons or user menu */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to={getDashboardUrl()}>Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border overflow-hidden cursor-pointer hover:bg-muted transition-colors">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user?.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-xs uppercase">
                        {user?.name ? getInitials(user.name) : "U"}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
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
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login"><LogIn className="mr-1.5 h-4 w-4" />Login</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-hero hover:opacity-90">
                <Link to="/signup"><UserPlus className="mr-1.5 h-4 w-4" />Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle with theme selector */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-card p-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary ${
                  location.pathname === l.to ? "text-primary bg-secondary" : "text-muted-foreground"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </nav>
          
          {isAuthenticated ? (
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <div className="flex items-center gap-3 px-3 py-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user?.name} 
                    className="h-9 w-9 rounded-full object-cover border border-border" 
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase border border-border">
                    {user?.name ? getInitials(user.name) : "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Link
                to={getDashboardUrl()}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Profile
              </Link>
              <Link
                to="/messages"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Messages
              </Link>
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                Notifications
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 text-left"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              </Button>
              <Button size="sm" className="flex-1 bg-gradient-hero" asChild>
                <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
