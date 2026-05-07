import { useEffect, useState } from "react";
import { getAllProperties } from "../lib/PropertyApi";

const Home = () => {
  console.log("Index page loaded");
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        console.log("Properties:", data);
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Properties</h2>

      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        properties.map((property, index) => (
          <div key={index}>
            <p>{property.title}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;