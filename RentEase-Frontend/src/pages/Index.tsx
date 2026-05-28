import { useEffect, useState } from "react";
import { getAllProperties } from "../lib/PropertyApi";

const Home = () => {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">

      {/* HERO SECTION */}
      <section className="px-6 py-16 text-center">

        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-900">
          Find Your Perfect Rental Home
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
          Discover verified properties with zero brokerage,
          smart recommendations, and instant owner connections.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">

          <button className="rounded-xl bg-black px-6 py-3 text-white transition hover:scale-105">
            Explore Properties
          </button>

          <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 transition hover:bg-slate-100">
            View Map
          </button>

        </div>
      </section>

      {/* GOOGLE MAP */}
      <section className="px-6">

        <div className="overflow-hidden rounded-3xl border bg-white shadow-xl">

          <iframe
            title="Property Map"
            src="https://maps.google.com/maps?q=mumbai&t=&z=11&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="500"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>

        </div>

      </section>

      {/* STATS */}
      <section className="grid gap-6 px-6 py-12 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-3xl font-bold text-slate-900">
            500+
          </h2>
          <p className="mt-2 text-slate-600">
            Verified Properties
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-3xl font-bold text-slate-900">
            ₹15L+
          </h2>
          <p className="mt-2 text-slate-600">
            Brokerage Saved
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-3xl font-bold text-slate-900">
            1200+
          </h2>
          <p className="mt-2 text-slate-600">
            Happy Tenants
          </p>
        </div>

      </section>

      {/* PROPERTY LIST */}
      <section className="px-6 pb-16">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold text-slate-900">
            Featured Properties
          </h2>

          <button className="rounded-xl border border-slate-300 bg-white px-5 py-2 transition hover:bg-slate-100">
            View All
          </button>

        </div>

        {properties.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-lg text-slate-500">
              No properties found
            </p>
          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {properties.map((property, index) => (

              <div
                key={index}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">

                  <img
                    src={
                      property.image ||
                      property.imageUrl ||
                      "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
                    }
                    alt={property.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                    Verified
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                    No Brokerage
                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-6">

                  <div className="mb-3 flex items-center justify-between">

                    <h3 className="text-2xl font-bold text-slate-900">
                      {property.title}
                    </h3>

                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium">
                      ₹ {property.rent || property.price}
                    </span>

                  </div>

                  <p className="mb-4 text-slate-600">
                    📍 {property.city || property.location}
                  </p>

                  <p className="mb-6 line-clamp-3 text-sm text-slate-500">
                    {property.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">

                    {property.propertyType && (
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs">
                        {property.propertyType}
                      </span>
                    )}

                    {property.bhk && (
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs">
                        {property.bhk} BHK
                      </span>
                    )}

                    {property.areaSqFt && (
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs">
                        {property.areaSqFt} sqft
                      </span>
                    )}

                  </div>

                  <div className="flex items-center justify-between">

                    <button className="rounded-xl bg-black px-5 py-2 text-white transition hover:opacity-90">
                      View Details
                    </button>

                    <button className="rounded-xl border border-slate-300 px-5 py-2 transition hover:bg-slate-100">
                      ❤️ Save
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Home;