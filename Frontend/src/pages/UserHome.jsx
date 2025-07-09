import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { getFareEstimate, createRide } from "../redux/services/User";
import { useSelector } from "react-redux";
import Logo from "../assets/Logo.png";
import { getSocket } from "../redux/services/Socket";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LiveTracking from "./LiveTracking";

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(""); // Track which field is active
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "",
  }); // Toast state (renamed to avoid conflict)

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);

  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState("");
  const [ride, setRide] = useState({});

  const [selectedVehicleDistance, setSelectedVehicleDistance] = useState(0);
  const [selectedVehicleDuration, setSelectedVehicleDuration] = useState(0);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const user = useSelector((state) => state.user.user);

  const socket = getSocket();
  useEffect(() => {
    socket.emit("join", { userId: user?._id, userType: "user" });
  }, [user]);

  // Toast function
  const showToast = (message, type = "error") => {
    setToastState({ show: true, message, type });
    setTimeout(() => {
      setToastState({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (activeField === "pickup") {
      setPickup(location);
    } else if (activeField === "destination") {
      setDestination(location);
    }
    // Reset any other panels that might be open to ensure clean state
    setVehiclePanel(false);
    setConfirmRidePanel(false);
    setVehicleFound(false);
    setWaitingForDriver(false);
  };

  const handleFindTrip = async () => {
    if (!pickup.trim() || !destination.trim()) {
      showToast("Please select both pickup and destination locations");
      return;
    }

    setIsLoading(true);
    showToast("Taking you to vehicle selection page...", "loading");

    try {
      const fare = await getFareEstimate(pickup, destination);

      // Simulate a brief delay to show the loading message
      setTimeout(() => {
        setPanelOpen(false);
        setVehiclePanel(true);
        setFare(fare);
        setIsLoading(false);
        setToastState({ show: false, message: "", type: "" });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      showToast("Failed to fetch fare. Please try again.");
    }
  };

  useEffect(() => {
    socket.on("ride-started", (data) => {
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride: data } });
    });

    socket.on("ride-canceled", (data) => {
      setVehiclePanel(true);
      setConfirmRidePanel(false);
      setWaitingForDriver(false);
      setVehicleFound(false);
      toast("The captain has cancelled the ride.");
    });

    socket.on("ride-confirmed", (data) => {
      setRide(data);
      setVehicleFound(false);
      // Close other panels but keep waiting for driver open
      setPanelOpen(false);
      setVehiclePanel(false);
      setConfirmRidePanel(false);
      setWaitingForDriver(true);
    });

    // Cleanup socket listeners
    return () => {
      socket.off("ride-started");
      socket.off("ride-canceled");
      socket.off("ride-confirmed");
    };
  }, [socket, navigate]);

  useGSAP(
    function () {
      if (panelOpen) {
        // Responsive height - smaller on mobile devices
        const isMobile = window.innerWidth < 768;
        const targetHeight = isMobile ? "55%" : "50%";

        gsap.to(panelRef.current, {
          height: targetHeight,
          padding: window.innerWidth < 640 ? 16 : 24,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  const createRideFunc = async () => {
    const small = vehicleType.toLowerCase();
    const fareAmount = fare?.fares?.[small]?.fare;

    const response = await createRide(
      pickup,
      destination,
      vehicleType,
      fareAmount,
      selectedVehicleDistance,
      selectedVehicleDuration
    );
    return response;
  };

  // Function to close all panels
  const closeAllPanels = () => {
    setPanelOpen(false);
    setVehiclePanel(false);
    setConfirmRidePanel(false);
    setVehicleFound(false);
    setWaitingForDriver(false);
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Full Screen Map - Behind everything */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{ pointerEvents: "auto" }}
      >
        <LiveTracking height="70vh" />
      </div>

      {/* Toast Notification */}
      {toastState.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg bg-black text-white font-medium transition-all duration-300">
          <div className="flex items-center gap-2">
            {toastState.type === "loading" && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {toastState.type === "error" && (
              <i className="ri-error-warning-line"></i>
            )}
            <span>{toastState.message}</span>
          </div>
        </div>
      )}

      {/* Logo - Above map */}
      <div className="absolute top-0 left-0 z-10 pointer-events-none">
        <img
          src={Logo}
          alt="Logo"
          className="w-28 pl-3 pt-3 rounded-xl object-contain"
        />
      </div>
      {/* Action Buttons */}
      <div className="absolute top-8 right-5 z-[1000]">
        <Link
          to="/user/logout"
          className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center rounded-full shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200"
        >
          <i className="text-lg sm:text-xl lg:text-2xl font-bold ri-logout-box-r-line text-black"></i>
        </Link>
      </div>

      {/* Main UI Panel Container - Fixed height for better mobile experience */}
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full z-20 pointer-events-none">
        <div className="min-h-[280px] h-auto md:h-[30%] p-4 sm:p-6 bg-white relative pointer-events-auto flex flex-col">
          <h5
            ref={panelCloseRef}
            onClick={closeAllPanels}
            className="absolute opacity-0 right-4 sm:right-6 top-4 sm:top-6 text-xl sm:text-2xl cursor-pointer z-50"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl sm:text-2xl font-semibold mb-2 font-serif">
            Find a trip
          </h4>
          <form
            className="relative py-2 flex-1"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute p-1 h-14 sm:h-16 w-1 top-[43%] -translate-y-1/2 left-4 sm:left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                // Close all panels and reset state when clicking pickup
                closeAllPanels();
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
              className="bg-[#eee] px-10 sm:px-12 py-2 sm:py-2 text-base sm:text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <br />
            <br />

            <input
              onClick={() => {
                // Close all panels and reset state when clicking destination
                closeAllPanels();
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="bg-[#eee] px-10 sm:px-12 py-2 sm:py-2 text-base sm:text-lg rounded-lg w-full mt-2 sm:mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>

          {/* Find Trip Button - Enhanced visibility */}
          <button
            onClick={handleFindTrip}
            disabled={!pickup.trim() || !destination.trim() || isLoading}
            className={`w-full mt-3 sm:mt-4 py-3 sm:py-3 rounded-lg text-white font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-2 relative z-30 ${
              pickup.trim() && destination.trim() && !isLoading
                ? "bg-black hover:bg-gray-800 active:bg-gray-900 shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            style={{ minHeight: "44px" }} // Ensure minimum tap target
          >
            {isLoading ? (
              <>
                <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Finding Trip...</span>
              </>
            ) : (
              "Find Trip"
            )}
          </button>
        </div>

        {/* Location Search Panel - Better mobile positioning */}
        <div
          ref={panelRef}
          className="bg-white h-0 relative z-25 pointer-events-auto overflow-hidden"
        >
          <div className="h-full">
            <LocationSearchPanel
              setPanelOpen={setPanelOpen}
              onLocationSelect={handleLocationSelect}
              searchQuery={activeField === "pickup" ? pickup : destination}
              activeField={activeField}
            />
          </div>
        </div>
      </div>

      {/* Vehicle Selection Panel */}
      {vehiclePanel && (
        <div
          ref={vehiclePanelRef}
          className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 sm:py-10 pt-8 sm:pt-12"
        >
          <div className="relative">
            <VehiclePanel
              setConfirmRidePanel={setConfirmRidePanel}
              setVehiclePanel={setVehiclePanel}
              setVehicleType={setVehicleType}
              fare={fare}
              setSelectedVehicleDistance={setSelectedVehicleDistance}
              setSelectedVehicleDuration={setSelectedVehicleDuration}
            />
          </div>
        </div>
      )}

      {/* Confirm Ride Panel */}
      {confirmRidePanel && (
        <div
          ref={confirmRidePanelRef}
          className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-4 sm:py-6 pt-8 sm:pt-12"
        >
          <div className="relative">
            <ConfirmRide
              createRide={createRideFunc}
              pickup={pickup}
              fare={fare}
              destination={destination}
              vehicleType={vehicleType}
              setConfirmRidePanel={setConfirmRidePanel}
              setVehicleFound={setVehicleFound}
            />
          </div>
        </div>
      )}

      {/* Looking for Driver Panel - Fixed to only show when vehicleFound is true */}
      <div
        ref={vehicleFoundRef}
        className="fixed w-full bottom-0 translate-y-full bg-white px-3 py-6 sm:py-8 pt-8 sm:pt-12 min-h-[54%] z-500"
        style={{
          display: vehicleFound ? "block" : "none",
        }}
      >
        <div className="relative">
          <LookingForDriver
            pickup={pickup}
            fare={fare}
            destination={destination}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>

      {/* Waiting for Driver Panel */}
      {waitingForDriver && (
        <div
          ref={waitingForDriverRef}
          className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-4 sm:py-6 pt-6 sm:pt-8"
        >
          <div className="relative">
            <WaitingForDriver
              vehicleType={vehicleType}
              ride={ride}
              waitingForDriver={waitingForDriver}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
