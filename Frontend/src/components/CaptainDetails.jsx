import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updateCaptainProfile } from "../redux/services/Captain";
import { useDispatch } from "react-redux";
import { getCaptainEarnings } from "../redux/services/Captain";
import { useNavigate } from "react-router-dom";
const CaptainDetails = () => {
  const captain = useSelector((state) => state.captain.captain);
  const [isActive, setIsActive] = useState(captain?.status);
  const dispatch = useDispatch();
  const [earnings, setEarnings] = useState(0);
  const navigate = useNavigate();

  const handleTripHistoryClick = () => {
    navigate("/trip-history");
  };
  useEffect(() => {
    if (captain) {
      const fetchEarnings = async () => {
        try {
          const response = await getCaptainEarnings();
          console.log("Captain earnings:", response);
          setEarnings(response.earnings || 0);
        } catch (error) {
          console.error("Error fetching earnings:", error);
        }
      };
      fetchEarnings();
    }
  }, [captain]);

  const toggleStatus = async () => {
    setIsActive(!isActive);
    await dispatch(updateCaptainProfile());
  };

  const vehicleDetails = captain?.vehicle || {
    vehicleType: "car",
    plateNumber: "MH-12-AB-1234",
    color: "red",
    capacity: "2",
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-start gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white font-semibold text-lg uppercase">
            {captain?.firstname?.charAt(0) || "S"}
          </div>
          <div>
            <h4 className="text-lg font-semibold capitalize text-gray-900">
              {(captain?.firstname || "sumit") +
                " " +
                (captain?.lastname || "thakur")}
            </h4>
            <p className="text-sm text-gray-600">
              Captain ID: #{captain?._id || "68551a47a7316687e01cf14e"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <h4 className="text-xl font-bold text-gray-900">₹{earnings}</h4>
          <p className="text-sm text-gray-600">Today's Earnings</p>
        </div>
      </div>

      {/* Status Toggle Button */}
      <div className="mb-6">
        <button
          onClick={toggleStatus}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 border ${
            isActive
              ? "bg-black text-white border-black hover:bg-gray-800"
              : "bg-white text-black border-black hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isActive ? "bg-white" : "bg-black"
              }`}
            ></div>
            {isActive
              ? "Active - Available for Rides"
              : "Inactive - Not Available"}
          </div>
        </button>
      </div>

      {/* Vehicle Details Section */}
      <div className="bg-white border border-gray-300 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <i className="text-xl ri-car-fill text-black"></i>
          <h3 className="text-lg font-semibold text-gray-900">
            Vehicle Details
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Vehicle Type
              </p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {vehicleDetails.vehicleType}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Capacity
              </p>
              <p className="text-sm font-medium text-gray-900">
                {vehicleDetails.capacity} Passengers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Plate Number
              </p>
              <p className="text-sm font-medium text-gray-900  ">
                {vehicleDetails.plateNumber || vehicleDetails.plate}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Color
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {vehicleDetails.color}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="mt-4">
        <button
          className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300"
          onClick={handleTripHistoryClick}
        >
          <i className="ri-history-line mr-1"></i>
          Trip History
        </button>
      </div>
    </div>
  );
};

export default CaptainDetails;
