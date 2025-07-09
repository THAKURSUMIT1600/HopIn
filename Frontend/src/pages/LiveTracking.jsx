import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon for current location
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-location-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        position: relative;
        animation: pulse 2s infinite;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const fallbackCenter = { lat: 28.6139, lng: 77.209 };

function Recenter({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos && pos.lat && pos.lng) {
      map.flyTo([pos.lat, pos.lng], map.getZoom(), {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [pos, map]);
  return null;
}

const LiveTracking = ({
  width = "100%",
  height = "400px",
  showAccuracyCircle = true,
  enablePulseAnimation = true,
  zoomLevel = 15,
  className = "",
}) => {
  const [currentPos, setCurrentPos] = useState(fallbackCenter);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const watchId = useRef();
  const mapRef = useRef();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentPos({
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setAccuracy(coords.accuracy);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    // Watch position changes
    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setCurrentPos({
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setAccuracy(coords.accuracy);
        setError(null);
      },
      (err) => {
        setError("Location tracking error");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000,
      }
    );

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Invalidate map size when dimensions change
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
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  };

  const loadingStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  };

  const statusStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 1000,
    background: error ? "rgba(239, 68, 68, 0.9)" : "rgba(34, 197, 94, 0.9)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    backdropFilter: "blur(10px)",
  };

  const spinnerStyle = {
    width: "20px",
    height: "20px",
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 8px",
  };

  return (
    <div style={containerStyle} className={className}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Hide Leaflet attribution */
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
      {loading && (
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          Getting your location...
        </div>
      )}
      <MapContainer
        center={[currentPos.lat, currentPos.lng]}
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

        {/* Accuracy circle */}
        {showAccuracyCircle && accuracy && (
          <Circle
            center={[currentPos.lat, currentPos.lng]}
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

        {/* Current location marker */}
        <Marker
          position={[currentPos.lat, currentPos.lng]}
          icon={createCustomIcon()}
        />

        <Recenter pos={currentPos} />
      </MapContainer>
    </div>
  );
};

export default LiveTracking;
