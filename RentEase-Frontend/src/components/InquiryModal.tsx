import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Loader2,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { submitInquiry } from "../lib/InquiryApi";
import { toast } from "sonner";

interface InquiryModalProps {
  propertyId: number | string;
  propertyTitle: string;
  ownerName: string;
  children: React.ReactNode;
}

export default function InquiryModal({
  propertyId,
  propertyTitle,
  ownerName,
  children,
}: InquiryModalProps) {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState(
    "Hi, I'm interested in this property. Please share more details."
  );

  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
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
        visitTime,
        phone,
        status: "SCHEDULED",
      });

      setSent(true);

      toast.success("Visit request sent successfully!");

      setTimeout(() => {
        setSent(false);
        setOpen(false);

        setMessage(
          "Hi, I'm interested in this property. Please share more details."
        );

        setVisitDate("");
        setVisitTime("");
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
          <DialogTitle className="text-lg">
            Schedule Property Visit
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Contact {ownerName} regarding "{propertyTitle}"
          </p>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>

            <h3 className="text-lg font-semibold">
              Visit Scheduled Successfully!
            </h3>

            <p className="text-sm text-muted-foreground text-center">
              Your visit request has been sent to the owner for approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="inquiry-message">
                Your Message
              </Label>

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
                <Label htmlFor="inquiry-date">
                  Preferred Visit Date
                </Label>

                <Input
                  id="inquiry-date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="inquiry-time">
                  Preferred Time
                </Label>

                <Input
                  id="inquiry-time"
                  type="time"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="inquiry-phone">
                  Phone Number
                </Label>

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

            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4" />
                Visit Status
              </div>

              <p className="mt-1 text-muted-foreground">
                Status: Scheduled (Waiting for owner approval)
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-hero hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Schedule Visit
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}