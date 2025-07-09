import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getSocket } from "../redux/services/Socket";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../assets/Logo.png";
import RealTimeTracker from "./RealTimeTracker";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const navigate = useNavigate();
  const socket = getSocket();
  const vehicles = [
    {
      id: "Car",
      name: "Car",
      capacity: 4,
      description: "Affordable, compact rides",
      image:
        "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
      fareKey: "car",
    },
    {
      id: "MotorCycle",
      name: "Motorcycle",
      capacity: 1,
      description: "Affordable motorcycle rides",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
      fareKey: "motorcycle",
    },
    {
      id: "Auto",
      name: "Auto",
      capacity: 3,
      description: "Affordable Auto rides",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
      fareKey: "auto",
    },
  ];

  // Fallback data in case ride is not available
  const captain = ride?.captain || {};
  const rideData = ride || {};

  // Get vehicle image based on vehicle type
  const getVehicleImage = (vehicleType) => {
    const vehicle = vehicles.find(
      (v) =>
        v.fareKey === vehicleType?.toLowerCase() ||
        v.name.toLowerCase() === vehicleType?.toLowerCase()
    );
    return vehicle ? vehicle.image : vehicles[0].image;
  };

  socket.on("ride-finished", (data) => {
    toast("Ride finished successfully");
    navigate("/home");
  });

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Home Button */}

      {/* Map Section - 60% */}
      <div className="h-[60%] relative">
        <div className="fixed p-4 sm:p-6 top-0 flex items-center justify-between w-screen z-[600]">
          <img
            src={Logo}
            alt="Logo"
            className="w-20 sm:w-24 object-contain filter grayscale"
          />
        </div>
        <div className="">
          <RealTimeTracker height="100%" rideData={rideData} />
        </div>
      </div>

      {/* Popup Section - 40% */}
      <div className="h-[40%] p-3 sm:p-4 bg-white relative z-[500] overflow-y-auto border-t-4 ">
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-24 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center p-1 sm:p-2 flex-shrink-0">
            <img
              className="h-24 w-24 object-contain"
              src={getVehicleImage(captain.vehicle?.vehicleType)}
              alt={captain.vehicle?.vehicleType || "Vehicle"}
            />
          </div>
          <div className="text-right flex-1 ml-3 sm:ml-4">
            <h2 className="text-base sm:text-lg font-bold capitalize text-black">
              {captain.fullname
                ? `${captain.fullname.firstname} ${captain.fullname.lastname}`
                : "Captain Name"}
            </h2>
            <h4 className="text-lg sm:text-xl font-bold -mt-1 -mb-1 text-black">
              {captain.vehicle?.plate || "Vehicle Plate"}
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 capitalize font-medium">
              {captain?.vehicle?.vehicleType} - {captain?.vehicle?.color}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 border-b-2 border-gray-300">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <i className="text-sm sm:text-base ri-map-pin-fill text-white"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold text-black">
                Destination
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
                {rideData.destination || "Destination not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 border-b-2 border-gray-300">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <i className="text-sm sm:text-base ri-currency-line text-white"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-black">
                ₹{rideData.fare || "0"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Cash Payment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <i className="text-sm sm:text-base ri-time-line text-white"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold text-black">
                Ride in Progress
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-gray-700 font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Riding;
