import React, { useEffect, useState } from "react";

const LocationPrompt: React.FC = () => {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocation(`Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`);
      });
    }
  }, []);

  return (
    <div className="p-2 bg-gray-100">
      {location ? <p>Your location: {location}</p> : <p>Enable location for local news</p>}
    </div>
  );
};

export default LocationPrompt;
