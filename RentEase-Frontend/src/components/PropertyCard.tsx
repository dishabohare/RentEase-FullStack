import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  CheckCircle2,
  Bed,
  Bath,
  Maximize,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: any;
  isSaved?: boolean;
  onToggleSave?: (propertyId: number | string) => void;
}

export default function PropertyCard({
  property,
  isSaved = false,
  onToggleSave,
}: PropertyCardProps) {

  const brokerageSaved = Math.floor(
    property.rent * 0.5
  );

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover">

      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/3] overflow-hidden">

        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* VERIFIED PROPERTY */}
        {property.verified && (
          <Badge className="absolute left-3 top-3 gap-1 border-0 bg-green-600 text-white">
            <CheckCircle2 className="h-3 w-3" />
            Verified Property
          </Badge>
        )}

        {/* VERIFIED OWNER */}
        <Badge className="absolute left-3 top-14 gap-1 border-0 bg-blue-600 text-white">
          <ShieldCheck className="h-3 w-3" />
          Verified Owner
        </Badge>

        {/* FURNISHED */}
        <Badge className="absolute right-3 top-3 border-0 bg-card/90 text-foreground backdrop-blur-sm">
          {property.furnished}
        </Badge>

        {/* SAVE BUTTON */}
        <button
          onClick={(e) => {
            e.preventDefault();

            if (onToggleSave) {
              onToggleSave(property.id);
            }
          }}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition hover:scale-105"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isSaved
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground"
            }`}
          />
        </button>

      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* LOCATION */}
        <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">

          <MapPin className="h-4 w-4" />

          {property.location}

        </div>

        {/* TITLE */}
        <h3 className="mb-3 line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover:text-primary">

          {property.title}

        </h3>

        {/* DETAILS */}
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">

          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedrooms}
          </span>

          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms}
          </span>

          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {property.area} sqft
          </span>

        </div>

        {/* PRICE */}
        <div className="mb-4 flex items-center justify-between">

          <div>
            <span className="text-2xl font-extrabold text-primary">
              ₹{property.rent.toLocaleString()}
            </span>

            <span className="text-sm text-muted-foreground">
              /month
            </span>
          </div>

        </div>

        {/* BROKERAGE SAVED */}
        <div className="mb-4 rounded-xl bg-green-100 p-3 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">

          🎯 You save ₹{brokerageSaved.toLocaleString()} brokerage here

        </div>

        {/* ACTION BUTTON */}
        <Button
          size="sm"
          variant="default"
          asChild
          className="w-full rounded-xl"
        >
          <Link to={`/property/${property.id}`}>
            View Details
          </Link>
        </Button>

      </div>
    </div>
  );
}