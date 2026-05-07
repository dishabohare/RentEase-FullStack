import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, PlusCircle, Info, Phone, Menu, X, LogIn, UserPlus } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Explore", to: "/explore", icon: Search },
  { label: "Post Property", to: "/add-property", icon: PlusCircle },
  { label: "How It Works", to: "/#how-it-works", icon: Info },
  { label: "About", to: "/#about", icon: Info },
  { label: "Contact", to: "/#contact", icon: Phone },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
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

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login"><LogIn className="mr-1.5 h-4 w-4" />Login</Link>
          </Button>
          <Button size="sm" asChild className="bg-gradient-hero hover:opacity-90">
            <Link to="/signup"><UserPlus className="mr-1.5 h-4 w-4" />Sign Up</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
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
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-hero" asChild>
              <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
