import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Polyline,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icons
const createCaptainIcon = () => {
  return L.divIcon({
    className: "captain-location-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        position: relative;
        animation: pulse 2s infinite;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="font-size: 12px;">🚗</span>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createPickupIcon = () => {
  return L.divIcon({
    className: "pickup-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #10b981 0%, #047857 100%);
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">P</div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const createDestinationIcon = () => {
  return L.divIcon({
    className: "destination-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">D</div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const fallbackCenter = { lat: 28.6139, lng: 77.209 }; // Delhi as fallback

// Component to handle map centering and bounds
function MapController({ captainPos, pickupPos, destinationPos }) {
  const map = useMap();
  console.log(
    "Having location information :",
    captainPos,
    pickupPos,
    destinationPos
  );

  useEffect(() => {
    const positions = [captainPos, pickupPos, destinationPos].filter(
      (pos) => pos && pos.lat && pos.lng
    );

    if (positions.length === 0) {
      map.flyTo([captainPos.lat, captainPos.lng], 15, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
      return;
    }

    if (positions.length === 1) {
      map.flyTo([positions[0].lat, positions[0].lng], 15, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    } else {
      const bounds = L.latLngBounds(positions.map((pos) => [pos.lat, pos.lng]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
    }
  }, [captainPos, pickupPos, destinationPos, map]);

  return null;
}

// Enhanced geocoding function
const geocodeAddress = async (address) => {
  if (!address || typeof address !== "string" || address.trim() === "") {
    console.warn("Invalid address provided for geocoding");
    return null;
  }

  try {
    const cleanAddress = address.trim();
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        cleanAddress
      )}&limit=3&countrycodes=in&addressdetails=1`,
      {
        headers: {
          "User-Agent": "RideTracker/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
      };
    }

    console.warn("No geocoding results found for address:", cleanAddress);
    return null;
  } catch (error) {
    console.error("Geocoding error for address:", address, error);
    return null;
  }
};

// Function to get route from OSRM (Open Source Routing Machine)
const getOSRMRoute = async (start, end) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`,
      {
        headers: {
          "User-Agent": "RideTracker/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OSRM request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const coordinates = data.routes[0].geometry.coordinates;
      // Convert [lng, lat] to [lat, lng] for Leaflet
      return coordinates.map((coord) => [coord[1], coord[0]]);
    }

    return null;
  } catch (error) {
    console.error("OSRM routing error:", error);
    return null;
  }
};

// Fallback function using OpenRouteService
const getOpenRouteServiceRoute = async (start, end) => {
  try {
    // Note: For production, you should get your own API key from openrouteservice.org
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248YOUR_API_KEY&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`,
      {
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouteService request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const coordinates = data.features[0].geometry.coordinates;
      return coordinates.map((coord) => [coord[1], coord[0]]);
    }

    return null;
  } catch (error) {
    console.error("OpenRouteService routing error:", error);
    return null;
  }
};

// Enhanced route generation with multiple fallbacks
const generateRoute = async (start, end) => {
  if (!start || !end) return [];

  // Try OSRM first (free and reliable)
  console.log("Attempting to get route from OSRM...");
  let routePoints = await getOSRMRoute(start, end);

  if (routePoints) {
    console.log(
      "Route successfully fetched from OSRM with",
      routePoints.length,
      "points"
    );
    return routePoints;
  }

  // If OSRM fails, create an improved curved path
  console.log("OSRM failed, generating improved curved route...");
  return generateImprovedCurvedRoute(start, end);
};

// Improved curved route generation (better than straight line)
const generateImprovedCurvedRoute = (start, end) => {
  const latDiff = end.lat - start.lat;
  const lngDiff = end.lng - start.lng;
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  const steps = Math.max(30, Math.floor(distance * 1000)); // More points for longer distances

  const routePoints = [];

  // Create multiple control points for a more realistic path
  const midPoint1 = {
    lat: start.lat + latDiff * 0.3 + (Math.random() - 0.5) * 0.01,
    lng: start.lng + lngDiff * 0.3 + (Math.random() - 0.5) * 0.01,
  };

  const midPoint2 = {
    lat: start.lat + latDiff * 0.7 + (Math.random() - 0.5) * 0.01,
    lng: start.lng + lngDiff * 0.7 + (Math.random() - 0.5) * 0.01,
  };

  // Generate Bezier-like curve through control points
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    // Cubic bezier interpolation
    const lat =
      Math.pow(1 - t, 3) * start.lat +
      3 * Math.pow(1 - t, 2) * t * midPoint1.lat +
      3 * (1 - t) * Math.pow(t, 2) * midPoint2.lat +
      Math.pow(t, 3) * end.lat;

    const lng =
      Math.pow(1 - t, 3) * start.lng +
      3 * Math.pow(1 - t, 2) * t * midPoint1.lng +
      3 * (1 - t) * Math.pow(t, 2) * midPoint2.lng +
      Math.pow(t, 3) * end.lng;

    routePoints.push([lat, lng]);
  }

  return routePoints;
};

const RealTimeTracker = ({
  rideData,
  width = "100%",
  height = "100vh",
  showAccuracyCircle = true,
  zoomLevel = 15,
  className = "",
}) => {
  const [captainPos, setCaptainPos] = useState(fallbackCenter);
  const [pickupPos, setPickupPos] = useState(null);
  const [destinationPos, setDestinationPos] = useState(null);
  const [route, setRoute] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState("");
  const [geocodingStatus, setGeocodingStatus] = useState({
    pickup: false,
    destination: false,
  });
  const watchId = useRef();
  const mapRef = useRef();
  console.log("ridedataaaa", rideData?.pickup, rideData?.destination);

  // Geocode pickup and destination addresses
  useEffect(() => {
    const geocodeLocations = async () => {
      if (!rideData) {
        console.warn("No ride data provided");
        setError("No ride data available");
        return;
      }

      setGeocodingStatus({ pickup: false, destination: false });

      try {
        if (rideData.pickup) {
          console.log("Geocoding pickup address:", rideData.pickup);
          const pickupCoords = await geocodeAddress(rideData.pickup);
          if (pickupCoords) {
            setPickupPos(pickupCoords);
            setGeocodingStatus((prev) => ({ ...prev, pickup: true }));
            console.log("Pickup geocoded successfully:", pickupCoords);
          } else {
            console.warn("Failed to geocode pickup address:", rideData.pickup);
          }
        }

        if (rideData.destination) {
          console.log("Geocoding destination address:", rideData.destination);
          const destCoords = await geocodeAddress(rideData.destination);
          if (destCoords) {
            setDestinationPos(destCoords);
            setGeocodingStatus((prev) => ({ ...prev, destination: true }));
            console.log("Destination geocoded successfully:", destCoords);
          } else {
            console.warn(
              "Failed to geocode destination address:",
              rideData.destination
            );
          }
        }
      } catch (error) {
        console.error("Error during geocoding process:", error);
        setError("Failed to locate addresses on map");
      }
    };

    geocodeLocations();
  }, [rideData]);

  // Generate route between pickup and destination
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupPos && destinationPos) {
        setRouteLoading(true);
        setRouteInfo("Calculating route...");

        try {
          const routePoints = await generateRoute(pickupPos, destinationPos);
          setRoute(routePoints);

          if (routePoints.length > 0) {
            const distance = calculateDistance(pickupPos, destinationPos);
            setRouteInfo(`Route: ~${distance.toFixed(1)} km`);
          }
        } catch (error) {
          console.error("Route generation failed:", error);
          setRouteInfo("Route calculation failed");
        } finally {
          setRouteLoading(false);
        }
      } else {
        setRoute([]);
        setRouteInfo("");
      }
    };

    fetchRoute();
  }, [pickupPos, destinationPos]);

  // Calculate approximate distance between two points
  const calculateDistance = (pos1, pos2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const dLon = ((pos2.lng - pos1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.lat * Math.PI) / 180) *
        Math.cos((pos2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Captain location tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newPos = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
        setCaptainPos(newPos);
        setAccuracy(coords.accuracy);
        setLoading(false);
        setError(null);
        console.log(
          "Captain initial position:",
          newPos,
          "Accuracy:",
          coords.accuracy
        );
      },
      (err) => {
        console.error("Geolocation error:", err);
        let errorMessage = "Unable to get your location";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location services.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setError(errorMessage);
        setCaptainPos(fallbackCenter);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );

    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const newPos = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
        setCaptainPos(newPos);
        setAccuracy(coords.accuracy);
        console.log("Captain position updated:", newPos);
      },
      (err) => {
        console.error("Watch position error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [width, height]);

  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    position: "relative",
    background: "#f8fafc",
  };

  const loadingStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    backdropFilter: "blur(10px)",
  };

  const statusStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    zIndex: 1000,
    background: error ? "rgba(239, 68, 68, 0.9)" : "rgba(34, 197, 94, 0.9)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "24px",
    fontSize: "12px",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  };

  const infoStyle = {
    position: "absolute",
    top: "16px",
    left: "16px",
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "12px",
    color: "#374151",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "250px",
  };

  const spinnerStyle = {
    width: "24px",
    height: "24px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 12px",
  };

  const isGeocodingComplete =
    !rideData ||
    ((!rideData.pickup || geocodingStatus.pickup) &&
      (!rideData.destination || geocodingStatus.destination));

  return (
    <div style={containerStyle} className={className}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .leaflet-control-attribution {
          display: none !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.9) !important;
          color: #374151 !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          backdrop-filter: blur(10px);
        }
      `}</style>

      {(loading || !isGeocodingComplete) && (
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          {loading
            ? "Getting your location..."
            : "Locating pickup & destination..."}
        </div>
      )}

      <MapContainer
        center={[captainPos.lat, captainPos.lng]}
        zoom={zoomLevel}
        zoomControl={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
        ref={(mapInstance) => {
          if (mapInstance) {
            mapRef.current = mapInstance;
            setTimeout(() => mapInstance.invalidateSize(), 100);
          }
        }}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          tileSize={256}
          zoomOffset={0}
        />

        {/* Enhanced route line */}
        {route.length > 0 && (
          <>
            {/* Shadow/outline for better visibility */}
            <Polyline
              positions={route}
              pathOptions={{
                color: "#000000",
                weight: 6,
                opacity: 0.3,
              }}
            />
            {/* Main route line */}
            <Polyline
              positions={route}
              pathOptions={{
                color: "#3b82f6",
                weight: 4,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {/* Accuracy circle for captain */}
        {showAccuracyCircle && accuracy && captainPos && (
          <Circle
            center={[captainPos.lat, captainPos.lng]}
            radius={accuracy}
            pathOptions={{
              fillColor: "#3b82f6",
              fillOpacity: 0.1,
              color: "#3b82f6",
              weight: 1,
              opacity: 0.3,
            }}
          />
        )}

        {/* Captain location marker */}
        <Marker
          position={[captainPos.lat, captainPos.lng]}
          icon={createCaptainIcon()}
        />

        {/* Pickup location marker */}
        {pickupPos && (
          <Marker
            position={[pickupPos.lat, pickupPos.lng]}
            icon={createPickupIcon()}
          />
        )}

        {/* Destination location marker */}
        {destinationPos && (
          <Marker
            position={[destinationPos.lat, destinationPos.lng]}
            icon={createDestinationIcon()}
          />
        )}

        <MapController
          captainPos={captainPos}
          pickupPos={pickupPos}
          destinationPos={destinationPos}
        />
      </MapContainer>
    </div>
  );
};

// Example usage component - Now accepts rideData as a prop
const App = ({ rideData }) => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <RealTimeTracker
        rideData={rideData}
        width="100%"
        height="100%"
        showAccuracyCircle={true}
        zoomLevel={13}
      />
    </div>
  );
};

export default App;
