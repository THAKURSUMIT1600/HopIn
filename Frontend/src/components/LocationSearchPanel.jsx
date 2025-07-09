import React, { useState, useEffect } from "react";
import { getSuggestions } from "../redux/services/User"; // Adjust the import path as needed

const LocationSearchPanel = (props) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Debounce hook to prevent too many API calls
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(props.searchQuery, 300);

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.trim().length < 2) {
        setLocations([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const suggestions = await getSuggestions(debouncedSearchQuery.trim());

        // Ensure we have a valid array
        if (Array.isArray(suggestions)) {
          setLocations(suggestions);
        } else if (
          suggestions &&
          typeof suggestions === "object" &&
          suggestions.results
        ) {
          // Handle case where API returns {results: [...]}
          setLocations(
            Array.isArray(suggestions.results) ? suggestions.results : []
          );
        } else {
          setLocations([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch suggestions");
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]);

  const handleLocationClick = (location, coordinates = null) => {
    // Pass the selected location to parent component
    if (coordinates) {
      props.onLocationSelect(location, coordinates);
    } else {
      props.onLocationSelect(location);
    }
    // Don't automatically set vehicle panel - let parent handle the flow
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationText = `Pickup Location : ${latitude}, ${longitude}`;
        setGettingLocation(false);
        handleLocationClick(locationText, { lat: latitude, lng: longitude });
      },
      (err) => {
        setError(
          `Unable to retrieve your location: ${err.message || "Unknown error"}`
        );
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Searching locations...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">
          <i className="ri-error-warning-line text-2xl"></i>
        </div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state when no search query
  if (!props.searchQuery || props.searchQuery.trim().length < 2) {
    return (
      <div>
        {/* Show current location option for pickup locations */}
        {/* {props.activeField === "pickup" && (
          <div>
            <div className="mb-2 px-3 text-sm text-gray-600">
              Pick-up locations
            </div>
            <div
              onClick={getCurrentLocation}
              className="flex gap-4 border-2 p-3 border-blue-100 bg-blue-50 active:border-blue-400 rounded-xl items-center my-2 justify-start hover:bg-blue-100 cursor-pointer transition-colors"
            >
              <h2 className="bg-blue-200 h-8 flex items-center justify-center w-12 rounded-full">
                {gettingLocation ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <i className="ri-navigation-fill text-blue-600"></i>
                )}
              </h2>
              <div className="flex-1">
                <h4 className="font-medium text-blue-700">
                  {gettingLocation
                    ? "Getting location..."
                    : "Use Current Location"}
                </h4>
                <p className="text-sm text-blue-600">
                  {gettingLocation
                    ? "Please wait..."
                    : "Get my current location"}
                </p>
              </div>
            </div>
          </div>
        )} */}

        <div className="p-4 text-center text-gray-500">
          <i className="ri-search-line text-2xl mb-2"></i>
          <p>Start typing to search for locations</p>
        </div>
      </div>
    );
  }

  // Show no results state
  if (locations.length === 0 && props.searchQuery.length >= 2) {
    return (
      <div className="p-4 text-center text-gray-500">
        <i className="ri-map-pin-line text-2xl mb-2"></i>
        <p>No locations found for "{props.searchQuery}"</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 px-3 text-sm text-gray-600">
        {props.activeField === "pickup"
          ? "Pick-up locations"
          : "Destination locations"}
      </div>

      {/* Show current location option for pickup locations */}
      {/* {props.activeField === "pickup" && (
        <div
          onClick={getCurrentLocation}
          className="flex gap-4 border-2 p-3 border-blue-100 bg-blue-50 active:border-blue-400 rounded-xl items-center my-2 justify-start hover:bg-blue-100 cursor-pointer transition-colors"
        >
          <h2 className="bg-blue-200 h-8 flex items-center justify-center w-12 rounded-full">
            {gettingLocation ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <i className="ri-navigation-fill text-blue-600"></i>
            )}
          </h2>
          <div className="flex-1">
            <h4 className="font-medium text-blue-700">
              {gettingLocation ? "Getting location..." : "Use Current Location"}
            </h4>
            <p className="text-sm text-blue-600">
              {gettingLocation ? "Please wait..." : "Get my current location"}
            </p>
          </div>
        </div>
      )} */}

      {locations.map((location, idx) => {
        // Handle both string and object responses from API
        let locationText = "";
        let locationId = "";
        let secondaryText = "";

        if (typeof location === "string") {
          locationText = location;
          locationId = idx;
        } else if (typeof location === "object" && location !== null) {
          // Handle the API response structure based on your error message
          locationText =
            location.display_name ||
            location.display_place ||
            location.description ||
            location.name ||
            "Unknown location";
          locationId =
            location.place_id || location.osm_id || location.id || idx;
          secondaryText =
            location.display_address || location.secondary_text || "";
        } else {
          locationText = "Unknown location";
          locationId = idx;
        }

        return (
          <div
            key={locationId}
            onClick={() => handleLocationClick(locationText)}
            className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <div className="flex-1">
              <h4 className="font-medium">{locationText}</h4>
              {/* Show additional info if available */}
              {secondaryText && (
                <p className="text-sm text-gray-500">{secondaryText}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
