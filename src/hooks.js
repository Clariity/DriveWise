import React from "react";
import { useLocation } from "react-router-dom"

export function useGeolocation() {
  const [location, setLocation] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setLocation([coords.latitude, coords.longitude]),
        (error) => setError(error),
        options
      );
    } else {
      setError(new Error("The browser does not support geolocation"));
    }
  }, []);

  return [location, error];
}

export function useSearchParams() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  return {
    params
  }
}