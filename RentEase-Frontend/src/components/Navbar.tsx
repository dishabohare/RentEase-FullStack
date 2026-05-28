import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Home,
  Search,
  PlusCircle,
  Info,
  Phone,
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Bell,
  MessageCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Explore", to: "/explore", icon: Search },
  { label: "Post Property", to: "/add-property", icon: PlusCircle },
  { label: "About", to: "/about", icon: Info },
  { label: "Contact", to: "/contact", icon: Phone },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    navigate("/");
  };

  const getDashboardUrl = () => {
    if (user?.role === "ADMIN") return "/admin-dashboard";

    if (user?.role === "OWNER") return "/owner-dashboard";

    return "/tenant-dashboard";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">

      <div className="container flex h-16 items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight"
        >
          RentEase
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-2 md:flex">

          {navLinks.map((link) => {
            const Icon = link.icon;

            const isActive = location.pathname === link.to;

            return (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}

        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to={getDashboardUrl()}>
                  Dashboard
                </Link>
              </Button>

              {/* NOTIFICATION BELL */}
              <div className="relative">

                <DropdownMenu>

                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />

                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-80"
                  >
                    <DropdownMenuLabel>
                      Notifications
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <div className="space-y-2 p-2">

                      <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium">
                          ✅ Visit Approved
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Your property visit has been approved.
                        </p>
                      </div>

                      <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium">
                          💬 New Message
                        </p>

                        <p className="text-xs text-muted-foreground">
                          You received a new inquiry.
                        </p>
                      </div>

                      <div className="rounded-lg border p-3">
                        <p className="text-sm font-medium">
                          🏠 Property Verified
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Your listing is now verified.
                        </p>
                      </div>

                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* USER MENU */}
              <DropdownMenu>

                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {getInitials(user?.name || "User")}
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                  <DropdownMenuLabel>
                    {user?.name}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/messages">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Messages
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">

              <Button variant="ghost" asChild>
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>

              <Button asChild>
                <Link to="/auth">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>

            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">

          <div className="container flex flex-col gap-2 py-4">

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
