import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "../lib/api";
import { properties as mockProperties } from "@/data/mockData";
import { toast } from "sonner";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  Phone,
} from "lucide-react";
import InquiryModal from "@/components/InquiryModal";
import PropertyCard from "@/components/PropertyCard";

export default function PropertyDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/api/properties/${id}`);

        console.log("Fetched property detail:", response.data);

        if (response.data) {
          setProperty(response.data);
        } else {
          const mockP = mockProperties.find(
            (p) => String(p.id) === String(id)
          );

          setProperty(mockP);
        }
      } catch (error) {
        console.error("Error fetching property:", error);

        const mockP = mockProperties.find(
          (p) => String(p.id) === String(id)
        );

        if (mockP) {
          setProperty(mockP);

          toast.info("Showing cached demo property details.");
        } else {
          toast.error("Property not found.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (property) {
      document.title = `${property.title} | RentEase`;
    } else {
      document.title = "Property Details | RentEase";
    }
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />

        <div className="container flex-1 flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading property details...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />

        <div className="container flex-1 flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-2xl font-bold">
            Property Not Found
          </h1>

          <p className="text-sm text-muted-foreground mt-2">
            The property you are looking for does not exist or has been removed.
          </p>

          <Button asChild className="mt-6 bg-gradient-hero">
            <Link to="/explore">
              Go Back to Explore
            </Link>
          </Button>
        </div>

        <Footer />
      </div>
    );
  }

  const bedrooms =
    property.bedrooms ??
    Number(property.bhk ?? 0);

  const bathrooms =
    property.bathrooms ??
    Math.max(1, Number(property.bhk ?? 0) - 1);

  const area =
    property.area ??
    Number(property.areaSqFt ?? 0);

  const deposit =
    property.deposit ??
    Math.round(Number(property.rent ?? 0) * 4);

  const ownerName =
    property.ownerName ||
    property.owner?.name ||
    "Rahul Sharma";

  const ownerPhone =
    property.ownerPhone ||
    property.owner?.phone ||
    "+91 98765 43210";

  const ownerAvatar =
    property.ownerAvatar ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80";

  let furnishVal = property.furnished;

  if (typeof property.furnished === "boolean") {
    furnishVal = property.furnished
      ? "Furnished"
      : "Unfurnished";
  } else if (property.furnished === "yes") {
    furnishVal = "Furnished";
  } else if (property.furnished === "no") {
    furnishVal = "Unfurnished";
  }

  const formattedRent = property.rent
    ? Number(property.rent).toLocaleString()
    : "0";

  const formattedDeposit = deposit
    ? Number(deposit).toLocaleString()
    : "0";

  const similarProperties = mockProperties
    .filter(
      (p) =>
        String(p.id) !== String(property.id) &&
        (
          p.location === property.location ||
          Math.abs(
            (p.rent || 0) - (property.rent || 0)
          ) < 10000
        )
    )
    .slice(0, 3);

  const amenities =
    property.amenities || [
      "WiFi",
      "Power Backup",
      "Security",
      "Parking",
      "Water Supply",
      "AC",
    ];

  let mainImage =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

  let images: string[] = [];

  if (
    property.images &&
    property.images.length > 0
  ) {
    images = property.images.map((img: any) =>
      typeof img === "object"
        ? img.imageUrl
        : img
    );

    mainImage = images[0];
  } else if (property.image) {
    mainImage = property.image;
    images = [property.image];
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <div className="container flex-1 py-8 max-w-6xl">

        {/* Back Link */}
        <Link
          to="/explore"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Explore
        </Link>

        {/* Gallery */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">

          <div className="md:col-span-2 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={mainImage}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="hidden md:grid grid-rows-2 gap-4">

            {images.length > 1 ? (
              images
                .slice(1, 3)
                .map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-border aspect-[4/3] bg-muted"
                  >
                    <img
                      src={imgUrl}
                      alt={`${property.title} interior`}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-border aspect-[4/3] bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80"
                    alt="Interior layout"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="overflow-hidden rounded-xl border border-border aspect-[4/3] bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80"
                    alt="Interior view"
                    className="h-full w-full object-cover"
                  />
                </div>
              </>
            )}

          </div>
        </div>

        {/* Details */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            <div>

              <div className="flex flex-wrap items-center gap-2 mb-3">

                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  {property.propertyType ||
                    property.type ||
                    "Apartment"}
                </Badge>

                <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
                  {furnishVal || "Unfurnished"}
                </Badge>

                {property.verified && (
                  <Badge className="bg-success text-success-foreground gap-1 border-0">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Listing
                  </Badge>
                )}

              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                {property.title}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                {property.location ||
                  `${property.address}, ${property.city}`}
              </p>

            </div>

            <hr className="border-border" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-4 text-center">

              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Bedrooms
                </p>

                <p className="text-base font-bold text-foreground flex items-center justify-center gap-1">
                  <Bed className="h-4 w-4 text-primary" />
                  {bedrooms}
                </p>
              </div>

              <div className="border-x border-border">
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Bathrooms
                </p>

                <p className="text-base font-bold text-foreground flex items-center justify-center gap-1">
                  <Bath className="h-4 w-4 text-primary" />
                  {bathrooms}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Area
                </p>

                <p className="text-base font-bold text-foreground flex items-center justify-center gap-1">
                  <Maximize className="h-4 w-4 text-primary" />
                  {area} sqft
                </p>
              </div>

            </div>

            {/* Description */}
            <div className="space-y-2">

              <h2 className="text-lg font-bold text-foreground">
                About this Property
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description ||
                  "No description provided."}
              </p>

            </div>

            {/* Amenities */}
            <div className="space-y-3">

              <h2 className="text-lg font-bold text-foreground">
                Amenities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                {amenities.map((a: string) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 rounded-lg border border-border p-2.5 bg-card"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />

                    <span className="text-xs font-medium text-foreground">
                      {a}
                    </span>
                  </div>
                ))}

              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div>

            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">

              <div>

                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Monthly Rent
                </p>

                <div className="flex items-baseline gap-1">

                  <span className="text-3xl font-extrabold text-primary">
                    ₹{formattedRent}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    / month
                  </span>

                </div>

                <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground border-t border-border pt-3">

                  <span>Security Deposit:</span>

                  <span className="font-semibold text-foreground">
                    ₹{formattedDeposit}
                  </span>

                </div>

              </div>

              <hr className="border-border" />

              <div className="space-y-4">

                <h3 className="text-sm font-bold text-foreground">
                  Contact Owner
                </h3>

                <div className="flex items-center gap-3">

                  <img
                    src={ownerAvatar}
                    alt={ownerName}
                    className="h-11 w-11 rounded-full object-cover border border-border"
                  />

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {ownerName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Property Owner
                    </p>
                  </div>

                </div>

                {/* UPDATED BUTTONS */}
                <div className="space-y-3">

                  <InquiryModal
                    propertyId={property.id}
                    propertyTitle={property.title}
                    ownerName={
                      property.owner?.name || "Owner"
                    }
                  >
                    <Button className="w-full">
                      Send Inquiry Message
                    </Button>
                  </InquiryModal>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate("/messages");
                    }}
                  >
                    Message Owner
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full font-medium h-11"
                    asChild
                  >
                    <a
                      href={`tel:${ownerPhone}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      {ownerPhone}
                    </a>
                  </Button>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div className="container max-w-6xl pb-16">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold">
              Similar Properties
            </h2>

            <p className="text-muted-foreground">
              Recommended based on your interest
            </p>
          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {similarProperties.map((item: any) => (
            <PropertyCard
              key={item.id}
              property={item}
            />
          ))}

        </div>

      </div>

      <Footer />
    </div>
  );
}