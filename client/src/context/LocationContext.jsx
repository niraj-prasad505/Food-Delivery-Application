// client/src/context/LocationContext.jsx
import { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    return localStorage.getItem("snackdrop_location") || "";
  });

  const [coordinates, setCoordinates] = useState(() => {
    const localCoords = localStorage.getItem("snackdrop_coords");
    return localCoords ? JSON.parse(localCoords) : null;
  });

  useEffect(() => {
    if (location) {
      localStorage.setItem("snackdrop_location", location);
    }
  }, [location]);

  useEffect(() => {
    if (coordinates) {
      localStorage.setItem("snackdrop_coords", JSON.stringify(coordinates));
    }
  }, [coordinates]);

  return (
    <LocationContext.Provider
      value={{ location, setLocation, coordinates, setCoordinates }}
    >
      {children}
    </LocationContext.Provider>
  );
};