import React from "react";

const Descriptions = ({ data }) => {
  if (!data) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Function to safely access nested data
  const safeAccess = (obj, path, fallback = null) =>
    path.reduce((res, key) => (res && res[key] !== undefined ? res[key] : fallback), obj);

  // Function to check if any amenity exists in a category (fallback if necessary)
  const checkAmenityCategory = (obj, categories) => {
    const activities = categories
      .map((category) => safeAccess(obj, category))
      .filter((value) => value === true);
    return activities.length > 0 ? activities : null;
  };

  // Function to generate descriptions dynamically
  const generateDescription = (key) => {
    switch (key) {
      case "welcome":
        const title = safeAccess(data, ["title"]);
        const type = safeAccess(data, ["type"]);
        const neighborhood = safeAccess(data, ["location", "neighborhood"]);
        const city = safeAccess(data, ["location", "city"]);
        const region = safeAccess(data, ["location", "region"]);
        return title && type && neighborhood && city && region
          ? `Welcome to ${title}, a beautiful ${type} located in ${neighborhood}, ${city}, ${region}.`
          : "No welcome description available.";
        
      case "pricing":
        const basePrice = safeAccess(data, ["basePrice"]);
        const durationType = safeAccess(data, ["rental", "durationType"]);
        return basePrice && durationType
          ? `Enjoy our base price starting at MAD ${basePrice} per ${durationType}.`
          : "Pricing information not available.";

      case "amenities":
        // Check for available activities in amenities
        const activities = checkAmenityCategory(data, [
          ["amenities", "ActivitiesEntertainment", "tennis"],
          ["amenities", "ActivitiesEntertainment", "horseRiding"],
          ["amenities", "ActivitiesEntertainment", "cycling"],
          ["amenities", "ActivitiesEntertainment", "liveMusic"],
          ["amenities", "ActivitiesEntertainment", "bikeTours"],
          ["amenities", "ActivitiesEntertainment", "gamesRoom"],
          ["amenities", "ActivitiesEntertainment", "walkingTours"],
          ["amenities", "ActivitiesEntertainment", "hiking"],
          ["amenities", "ActivitiesEntertainment", "windsurfing"],
          ["amenities", "ActivitiesEntertainment", "billiards"]
        ]);

        // If activities exist, return them; otherwise, do not show the section.
        if (activities) {
          return `Enjoy activities such as ${activities.join(", ")}.`;
        }
        return null;

      case "roomFeatures":
        const privateBathroom = safeAccess(data, ["amenities", "RoomFeatures", "privateBathroom"]);
        const kitchen = safeAccess(data, ["amenities", "RoomFeatures", "kitchen"]);
        return `Relax with features like ${privateBathroom ? "a private bathroom" : "shared facilities"} and ${
          kitchen ? "a kitchen" : "no kitchen"
        }.`;

      case "location":
        const distanceFromCityCenter = safeAccess(data, ["location", "distanceFromCityCenter"]);
        return distanceFromCityCenter
          ? `Located ${distanceFromCityCenter} km from the city center, this property is perfect for travelers.`
          : "Location details not available.";

      

      case "policies":
        const petsAllowed = safeAccess(data, ["policies", "pets", "allowed"], false);
        const smokingAllowed = safeAccess(data, ["policies", "smoking", "allowed"], false);
        return `Policies: Pets are ${petsAllowed ? "allowed" : "not allowed"} and smoking is ${
          smokingAllowed ? "permitted" : "prohibited"
        }.`;

      case "languages":
        const languages = safeAccess(data, ["languages"], []);
        return languages.length > 0
          ? `We speak the following languages: ${languages.join(", ")}.`
          : "Languages information not available.";

      case "safety":
        const security24h = safeAccess(data, ["amenities", "SafetySecurity", "security24h"], false);
        const fireExtinguishers = safeAccess(data, ["amenities", "SafetySecurity", "fireExtinguishers"], false);
        return `Safety features include ${security24h ? "24-hour security" : ""}${
          security24h && fireExtinguishers ? " and " : ""
        }${fireExtinguishers ? "fire extinguishers" : ""}.`;

      default:
        return "No description available for this section.";
    }
  };

  const descriptionKeys = [
    "welcome",
    "pricing",
    "amenities",
    "roomFeatures",
    "location",
    "policies",
    "languages",
    "safety",
  ];

  const descriptions = descriptionKeys
    .map((key) => generateDescription(key))
    .filter((desc) => desc !== null); // Only include non-null descriptions

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Descriptions for {data?.title || "this property"}
      </h2>
      {descriptions.length > 0 ? (
        <ul className="space-y-4">
          {descriptions.map((desc, index) => (
            <li key={index} className="p-2 bg-white rounded shadow">
              {desc}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No descriptions available.</div>
      )}
    </div>
  );
};

export default Descriptions;
