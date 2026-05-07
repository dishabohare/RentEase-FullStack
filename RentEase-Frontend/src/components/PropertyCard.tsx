import { Link } from "react-router-dom";
import { Heart, MapPin, Home, CheckCircle2, Bed, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Property } from "@/data/mockData";

export default function PropertyCard({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-hover hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        {property.verified && (
          <Badge className="absolute left-3 top-3 bg-success text-success-foreground border-0 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </Badge>
        )}
        <Badge className="absolute right-3 top-3 bg-card/90 text-foreground border-0 backdrop-blur-sm">
          {property.furnished}
        </Badge>
        <button
          onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
          className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
        >
          <Heart className={`h-4 w-4 transition-colors ${saved ? "fill-accent text-accent" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {property.location}
        </div>
        <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{property.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{property.area} sqft</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">₹{property.rent.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/mo</span>
          </div>
          <Button size="sm" variant="outline" asChild className="text-xs">
            <Link to={`/property/${property.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
