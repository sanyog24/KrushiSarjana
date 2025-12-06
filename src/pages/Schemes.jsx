import React, { useState, useEffect } from "react";
import schemesData from "./schemes.json"; // Import the JSON file

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);

  // Load schemes from the JSON file on component mount
  useEffect(() => {
    console.log("Loaded schemes data:", schemesData); // Debugging
    if (schemesData && schemesData.government_schemes && Array.isArray(schemesData.government_schemes)) {
      setSchemes(schemesData.government_schemes);
    } else {
      console.error("Invalid data format: government_schemes is not an array");
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Government Schemes</h1>

      {/* Display the list of schemes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme, index) => (
          <SchemeCard key={index} scheme={scheme} />
        ))}
      </div>
    </div>
  );
};

// Reusable SchemeCard component
const SchemeCard = ({ scheme }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{scheme.name}</h2>
      <p className="text-gray-600 mb-4">{scheme.description}</p>
      <a
        href={scheme.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Apply Now
      </a>
    </div>
  );
};

export default SchemesPage;