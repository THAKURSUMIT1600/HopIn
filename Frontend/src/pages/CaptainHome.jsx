import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopup";
import LiveTracking from "./LiveTracking";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopup";
import { getSocket } from "../redux/services/Socket";
import { useSelector, useDispatch } from "react-redux";
import { confirmRide } from "../redux/services/Captain";
import Logo from "../assets/Logo.png";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const dispatch = useDispatch();
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const socket = getSocket();
  const [rideData, setRideData] = useState(null);

  const captain = useSelector((state) => state.captain.captain);

  useEffect(() => {
    if (!captain?._id) return;

    socket.emit("join", { userId: captain._id, userType: "captain" });

    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          };

          socket.emit("get-captain-location", {
            captainId: captain._id,
            location,
          });
        },
        (error) => {
          // Geolocation error
        }
      );
    }, 10000);

    return () => {
      clearInterval(intervalId);
      socket.emit("leave", { userId: captain._id, userType: "captain" });
    };
  }, [captain]);

  socket.on("new-ride", (data) => {
    setRideData(data);
    setRidePopupPanel(true);
  });

  // GSAP animations for ride popup
  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    [ridePopupPanel]
  );

  // GSAP animations for confirm ride popup
  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  const confirmRidee = async () => {
    confirmRide(rideData._id, captain._id);
    setConfirmRidePopupPanel(true);
    setRidePopupPanel(false);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 flex flex-col">
      {/* Map Section - Show always, adjust height based on active panel */}
      <div
        className="w-full relative"
        style={{
          height: ridePopupPanel
            ? "40vh"
            : confirmRidePopupPanel
            ? "0vh"
            : "70vh",
          transition: "height 0.3s",
        }}
      >
        <LiveTracking
          height={
            ridePopupPanel ? "40vh" : confirmRidePopupPanel ? "0vh" : "70vh"
          }
        />

        {/* Header overlaid on map - Show only when no confirm popup */}
        {!confirmRidePopupPanel && (
          <div className="absolute top-0 left-0 right-0 z-[999]">
            <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
              {/* Logo */}
              <div className="flex items-center z-[1000] relative">
                <div className="">
                  <img src={Logo} alt="Logo" className="w-24 object-contain" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 z-[1000] relative">
                <Link
                  to="/captain-home"
                  className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center rounded-full shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200"
                >
                  <i className="text-lg sm:text-xl lg:text-2xl font-bold ri-home-4-line text-black"></i>
                </Link>
                <Link
                  to="/captain/logout"
                  className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center rounded-full shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200"
                >
                  <i className="text-lg sm:text-xl lg:text-2xl font-bold ri-logout-box-r-line text-black"></i>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Captain Details Section - Show only when no popups */}
      {!ridePopupPanel && !confirmRidePopupPanel && (
        <div className="flex h-[30vh] flex-col bg-white">
          <div className="h-full p-3 sm:p-4 lg:p-6 xl:p-8 overflow-y-auto">
            <CaptainDetails />
          </div>
        </div>
      )}

      {/* Ride Popup Panel - 60% of screen height */}
      {rideData && (
        <div
          ref={ridePopupPanelRef}
          className={`
            fixed bottom-0 left-0 right-0 z-[70] 
            translate-y-full bg-white 
            ${!ridePopupPanel ? "pointer-events-none" : ""}
          `}
          style={{ height: "60vh" }}
        >
          <div className="h-full w-full flex flex-col">
            {/* Drag indicator */}
            <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
              <div
                className="w-12 h-1 bg-gray-300 rounded-full"
                onClick={() => setRidePopupPanel(false)}
              ></div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <RidePopUp
                setRidePopupPanel={setRidePopupPanel}
                rideData={rideData}
                setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                confirmRide={confirmRidee}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm Ride Popup Panel - Full screen overlay */}
      {rideData && (
        <div
          ref={confirmRidePopupPanelRef}
          className={`
            fixed inset-0 z-[80] 
            translate-y-full bg-white
            ${!confirmRidePopupPanel ? "pointer-events-none" : ""}
          `}
        >
          <div className="h-full w-full flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0"></div>

            {/* Content - Scrollable */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <ConfirmRidePopUp
                rideData={rideData}
                setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                setRidePopupPanel={setRidePopupPanel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainHome;
