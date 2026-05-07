import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Rent<span className="text-gradient-primary">Ease</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's trusted broker-free rental platform connecting owners and tenants directly.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[["Explore Properties", "/explore"], ["Post Property", "/add-property"], ["How It Works", "/#how-it-works"], ["About Us", "/#about"]].map(([label, to]) => (
                <Link key={to} to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">For Users</h4>
            <div className="flex flex-col gap-2">
              {["Tenant Dashboard", "Owner Dashboard", "Login", "Sign Up"].map((l) => (
                <Link key={l} to={`/${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Mail className="h-4 w-4" />hello@rentease.in</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" />+91 80 1234 5678</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />Bangalore, India</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 RentEase. All rights reserved. Made with ❤️ for hassle-free renting.
        </div>
      </div>
    </footer>
  );
}
