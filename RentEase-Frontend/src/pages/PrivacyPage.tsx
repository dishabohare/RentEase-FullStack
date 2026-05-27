import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | RentEase";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container max-w-3xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-muted-foreground">
              Last updated: May 27, 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              At RentEase, we value and respect your privacy. This document outlines how we collect, store, and utilize your personal information.
            </p>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">1. Information Collection</h2>
              <p>
                When you sign up or list a property, we collect personal identifiers such as your full name, email address, phone number, and account credentials. Profile pictures/avatars uploaded are saved directly in our database.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">2. Usage of Personal Data</h2>
              <p>
                We use your information to verify account details, facilitate communication between tenants and property owners, send transaction notifications, and display dynamic features on your custom dashboard panels.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">3. Security Standards</h2>
              <p>
                We use industry-standard security protocols to encrypt user passwords and secure communication channels. All tokens and credentials saved locally inside the browser localStorage are automatically included on secure requests.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">4. Cookies Policy</h2>
              <p>
                We utilize browser storage and cookies to maintain your login session across refreshes and remember your theme settings (dark/light toggles). You can manage cookies directly via your browser preferences.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
