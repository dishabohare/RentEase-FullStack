import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  useEffect(() => {
    document.title = "Terms & Conditions | RentEase";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container max-w-3xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-muted-foreground">
              Last updated: May 27, 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              Welcome to RentEase. By accessing or using our platform, you agree to comply with and be bound by these Terms & Conditions.
            </p>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">1. User Eligibility</h2>
              <p>
                You must be at least 18 years of age to register or post property listings on our website. By creating an account, you represent and warrant that all registration details submitted are accurate and truthful.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">2. Property Listing Rules</h2>
              <p>
                Owners are solely responsible for the properties they list. Listings must contain accurate addresses, pricing details, and descriptions. Any fraudulent, misleading, or deceptive property listings will be immediately flagged and removed by the administration.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">3. Zero Brokerage Policy</h2>
              <p>
                RentEase provides listing services without charging broker fees or commissions. Users should not pay any fees to third-party representatives claiming association with RentEase. Any financial arrangements made between owners and tenants are direct and outside our liability.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">4. Account Liabilities</h2>
              <p>
                You are responsible for safeguarding your login credentials. If you detect any unauthorized access, please report it immediately to support@rentease.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
