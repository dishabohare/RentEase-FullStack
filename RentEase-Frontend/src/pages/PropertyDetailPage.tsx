import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import api from "../lib/api";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("DETAIL PAGE NEW CODE RUNNING");

    const fetchProperty = async () => {
      try {
        const response = await api.get(`/api/properties/${id}`);
        console.log("Fetched property detail:", response.data);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <Link to="/explore" className="text-blue-600 underline">
          Back to Explore
        </Link>

        {loading ? (
          <p className="mt-6">Loading...</p>
        ) : !property ? (
          <div className="mt-6">
            <h1 className="text-2xl font-bold">Property Not Found</h1>
            <Button asChild className="mt-4">
              <Link to="/explore">Go Back</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p><strong>City:</strong> {property.city}</p>
            <p><strong>Address:</strong> {property.address}</p>
            <p><strong>Rent:</strong> ₹{property.rent}</p>
            <p><strong>Type:</strong> {property.propertyType}</p>
            <p><strong>BHK:</strong> {property.bhk}</p>
            <p><strong>Area:</strong> {property.areaSqFt} sqft</p>
            <p><strong>Furnished:</strong> {property.furnished ? "Yes" : "No"}</p>
            <p><strong>Description:</strong> {property.description}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}