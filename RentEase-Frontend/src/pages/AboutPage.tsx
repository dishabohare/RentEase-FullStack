import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles, Star, Users } from "lucide-react";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Us | RentEase";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container max-w-5xl space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1">
              About RentEase
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-none">
              Simplifying Rentals, <span className="text-gradient-primary">Zero Brokerage</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              We are on a mission to build India's most transparent, direct, and verified property rental platform, connecting tenants and owners without middlemen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="overflow-hidden rounded-2xl border border-border aspect-[16/10] shadow-card bg-muted">
              <img 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" 
                alt="Modern living room" 
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Why We Started RentEase</h2>
              <p className="text-muted-foreground leading-relaxed">
                Traditional property portals are saturated with fake listings, outdated details, and aggressive brokerage fees. RentEase was built as a clean, simple, and direct solution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By allowing owners to list their properties directly and permitting tenants to connect with them via secure chat or telephone, we eliminate administrative overhead and middleman charges completely.
              </p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Values Section */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">Our Core Values</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Shield, title: "100% Verification", desc: "Every property goes through a manual admin verification process before publishing." },
                { icon: Star, title: "Zero Brokerage", desc: "We charge absolutely zero commission or hidden broker charges for listings." },
                { icon: Users, title: "Direct Contact", desc: "Chat or call property owners directly to negotiate rent and arrange visits." },
                { icon: Sparkles, title: "Modern Experience", desc: "Enjoy clean typography, light/dark themes, and quick search filters." }
              ].map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{val.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
