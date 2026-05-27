import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { HelpCircle, MailCheck, MessageSquareWarning } from "lucide-react";

export default function HelpSupportPage() {
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = "Help & Support | RentEase";
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate support ticket creation
    setTimeout(() => {
      setSending(false);
      toast.success("Support ticket created!", {
        description: "A support agent will contact you at your registered email address.",
      });
      setSubject("");
      setDesc("");
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
          <p className="text-sm text-muted-foreground">Find answers or register a support ticket</p>
        </div>

        {/* FAQs */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-sm text-left hover:no-underline">How do I list my property?</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Log in as a Property Owner, navigate to your sidebar settings, and click "Add Property". Fill in the listing details, address, rent pricing, and submit. The property will immediately list in your dashboard.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-sm text-left hover:no-underline">Is there a brokerage charge?</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                No, RentEase is a broker-free platform. We do not charge listing fees or request commission commissions when you close transactions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-sm text-left hover:no-underline">How do I update my profile picture?</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Go to the Profile Settings page. Click the Camera icon on your avatar placeholder, choose an image (less than 2MB), and click save. The avatar updates instantly in the database.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-sm text-left hover:no-underline">How can I contact a property owner?</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                Open a property details page on the Explore page, and click the "Send Inquiry Message" button or use the phone number provided in the Contact panel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Form Support Ticket */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <MessageSquareWarning className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Open a Support Ticket</h2>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input 
                id="ticket-subject" 
                placeholder="e.g., Cannot upload property images" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ticket-desc">Description</Label>
              <Textarea 
                id="ticket-desc" 
                placeholder="Details about your issue..." 
                rows={4} 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" disabled={sending} className="bg-gradient-hero hover:opacity-90">
              <MailCheck className="mr-2 h-4 w-4" />
              {sending ? "Creating Ticket..." : "Submit Ticket"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
