import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { finishRide } from "../redux/services/Captain";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import RealTimeTracker from "./RealTimeTracker";
const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const { ride } = location.state || {};
  const navigate = useNavigate();
  const rideData = ride || {};
  const user = rideData.user || {};

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await finishRide(ride._id);
    if (response && response.ride) {
      toast("Ride finished successfully");
      navigate("/captain-home");
    } else {
      console.error("Unexpected response:", response);
    }
  };

  return (
    <div className="h-screen relative">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-500">
        <img src={Logo} alt="Logo" className="w-24 object-contain z-500" />
      </div>
      <div className="h-4/5">
        <RealTimeTracker height="80vh" rideData={rideData} />
      </div>
      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-white pt-10 cursor-pointer hover:bg-gray-100 transition-colors z-500"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5
          className="p-1 text-center w-[90%] absolute top-0"
          onClick={() => {}}
        >
          <i className="text-3xl text-black ri-arrow-up-wide-line"></i>
        </h5>
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold capitalize text-black">
            {user.fullname
              ? `${user.fullname.firstname} ${user.fullname.lastname}`
              : "Passenger Name"}
          </h4>
          <p className="text-sm text-gray-600">Fare: ₹{rideData.fare || "0"}</p>
        </div>
        <button
          className="bg-black text-white font-semibold p-3 px-10 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={submitHandler}
        >
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full bottom-0 translate-y-full bg-white px-3 py-10 pt-12 border-t border-gray-300 z-500"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} ride={rideData} />
      </div>
    </div>
  );
};

export default CaptainRiding;
