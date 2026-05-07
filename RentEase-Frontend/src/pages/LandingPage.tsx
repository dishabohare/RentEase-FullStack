import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/mockData";
import {
  Search, Shield, Users, Zap, CheckCircle2, ArrowRight,
  Home, DollarSign, Eye, MessageCircle, Star, Sparkles,
  CreditCard, Video, MapPin, FileText, Smartphone, Bot,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const steps = [
  { icon: Search, title: "Search Properties", desc: "Browse verified listings filtered by location, budget, and preferences." },
  { icon: Eye, title: "View & Compare", desc: "Explore property details, photos, amenities and compare options side-by-side." },
  { icon: MessageCircle, title: "Contact Owner Directly", desc: "Send inquiries and chat with property owners — zero middlemen." },
  { icon: Home, title: "Move In", desc: "Finalize the deal, sign the agreement, and move into your new home." },
];

const whyCards = [
  { icon: Shield, title: "Verified Listings", desc: "Every listing is verified to ensure authenticity and accuracy." },
  { icon: DollarSign, title: "Zero Brokerage", desc: "Save thousands — no broker fees, no hidden charges." },
  { icon: Users, title: "Direct Communication", desc: "Talk directly with property owners for transparent negotiations." },
  { icon: Zap, title: "Fast & Easy Search", desc: "Smart filters and AI-powered search to find your perfect home fast." },
];

const testimonials = [
  { name: "Sanya M.", role: "Tenant", text: "Found my dream apartment in just 3 days without paying any brokerage. RentEase is a game-changer!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", rating: 5 },
  { name: "Vikram R.", role: "Owner", text: "Listing my property was super easy. Got genuine tenants within a week. Highly recommend!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", rating: 5 },
  { name: "Priya K.", role: "Tenant", text: "The verified badge gave me confidence. Direct chat with the owner made everything smooth.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", rating: 4 },
];

const futureFeatures = [
  { icon: Bot, title: "AI Recommendations", desc: "Smart suggestions based on your preferences." },
  { icon: Shield, title: "KYC Verification", desc: "Enhanced trust with identity verification." },
  { icon: CreditCard, title: "Online Rent Payment", desc: "Pay rent securely through the platform." },
  { icon: Video, title: "Video Tours", desc: "Virtual property walkthroughs from anywhere." },
  { icon: MapPin, title: "Map Integration", desc: "Explore properties on an interactive map." },
  { icon: FileText, title: "Digital Agreements", desc: "Generate and sign rental agreements online." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="container relative z-10 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div {...fadeUp}>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
                🏠 India's Broker-Free Rental Platform
              </Badge>
            </motion.div>
            <motion.h1 {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find Your Perfect Rental{" "}
              <span className="text-gradient-primary">Without Brokers</span>
            </motion.h1>
            <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Direct owner-tenant communication, verified listings, and transparent pricing.
              Save thousands on brokerage and find your ideal home in minutes.
            </motion.p>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-gradient-hero hover:opacity-90 text-base px-8 h-12">
                <Link to="/explore"><Search className="mr-2 h-5 w-5" />Explore Properties</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-12">
                <Link to="/add-property">Post Your Property <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
          </div>

          {/* Trust badges */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }} className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: CheckCircle2, label: "Verified Listings", value: "500+" },
              { icon: DollarSign, label: "No Brokerage", value: "₹0" },
              { icon: Users, label: "Direct Contact", value: "1000+" },
              { icon: Zap, label: "Fast Search", value: "< 5 min" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center rounded-xl border border-border bg-card p-4 shadow-card">
                <b.icon className="mb-2 h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">{b.value}</span>
                <span className="text-xs text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/20">Simple Process</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">How RentEase Works</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Four simple steps to find your next rental home — no brokers, no hassle.</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div key={s.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground">
                  <s.icon className="h-7 w-7" />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">{i + 1}</span>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose RentEase */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Why Us</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Why Choose RentEase?</h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((c, i) => (
              <motion.div key={c.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <Badge className="mb-3 bg-accent/10 text-accent border-accent/20">Featured</Badge>
              <h2 className="text-3xl font-bold text-foreground">Featured Properties</h2>
            </div>
            <Button variant="ghost" asChild className="text-primary">
              <Link to="/explore">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.slice(0, 4).map((p, i) => (
              <motion.div key={p.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Testimonials</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">What Our Users Say</h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-4 w-4 ${j < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="py-20">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/20"><Sparkles className="mr-1 h-3 w-3" />Coming Soon</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">What's Next for RentEase</h2>
            <p className="mt-3 text-muted-foreground">Exciting features on the roadmap to make renting even easier.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {futureFeatures.map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-xl border border-dashed border-border bg-card/50 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <motion.div {...fadeUp} className="rounded-2xl bg-gradient-hero p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Find Your Next Home?</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Join thousands of happy tenants and owners on India's most trusted broker-free rental platform.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild className="text-primary font-semibold px-8 h-12">
                <Link to="/explore">Start Exploring</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-12">
                <Link to="/signup">Create Free Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
