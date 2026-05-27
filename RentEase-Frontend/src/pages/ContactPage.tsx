import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | RentEase";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate contact form submission
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully!", {
        description: "Our support team will get back to you within 24 hours.",
      });
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Get in Touch
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Have questions about listing or rent payments? Drop us a line.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Details Card */}
            <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
              <h2 className="text-lg font-bold text-foreground">Contact Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reach out to us directly or visit our office. We are always ready to help.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Phone</p>
                    <a href="tel:+919876543210" className="text-sm font-medium text-foreground hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Email</p>
                    <a href="mailto:support@rentease.com" className="text-sm font-medium text-foreground hover:underline">
                      support@rentease.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Office Address</p>
                    <p className="text-sm font-medium text-foreground">
                      Vijay Nagar, Indore, MP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="contact-name">Your Name</Label>
                    <Input 
                      id="contact-name" 
                      placeholder="John Doe" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input 
                      id="contact-email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea 
                    id="contact-message" 
                    placeholder="Describe your inquiry..." 
                    rows={5} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required 
                  />
                </div>

                <Button type="submit" className="bg-gradient-hero hover:opacity-90 min-w-[150px]" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
