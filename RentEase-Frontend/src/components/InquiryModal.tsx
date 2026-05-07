import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2 } from "lucide-react";

interface InquiryModalProps {
  propertyTitle: string;
  ownerName: string;
  children: React.ReactNode;
}

export default function InquiryModal({ propertyTitle, ownerName, children }: InquiryModalProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <Dialog>
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
              <Label>Your Message</Label>
              <Textarea placeholder="Hi, I'm interested in this property..." rows={4} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Preferred Visit Date</Label>
                <Input type="date" required />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="+91 99999 99999" required />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90">
              <Send className="mr-2 h-4 w-4" /> Send Inquiry
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
