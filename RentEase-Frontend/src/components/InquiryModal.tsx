import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitInquiry } from "../lib/InquiryApi";
import { toast } from "sonner";

interface InquiryModalProps {
  propertyId: number | string;
  propertyTitle: string;
  ownerName: string;
  children: React.ReactNode;
}

export default function InquiryModal({ propertyId, propertyTitle, ownerName, children }: InquiryModalProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Hi, I'm interested in this property. Please share more details.");
  const [visitDate, setVisitDate] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitInquiry({
        propertyId,
        message,
        visitDate,
        phone
      });
      setSent(true);
      toast.success("Inquiry sent successfully!");
      setTimeout(() => {
        setSent(false);
        setOpen(false);
        setMessage("Hi, I'm interested in this property. Please share more details.");
        setVisitDate("");
        setPhone("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Send Inquiry</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Reach out to {ownerName} about "{propertyTitle}"
          </p>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Inquiry Sent!</h3>
            <p className="text-sm text-muted-foreground text-center">The owner will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="inquiry-message">Your Message</Label>
              <Textarea
                id="inquiry-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this property..."
                rows={4}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="inquiry-date">Preferred Visit Date</Label>
                <Input
                  id="inquiry-date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="inquiry-phone">Phone Number</Label>
                <Input
                  id="inquiry-phone"
                  type="tel"
                  placeholder="+91 99999 99999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-hero hover:opacity-90">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Inquiry
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
