import React from "react";
import { Link } from "react-router-dom";
import { finishRide } from "../redux/services/Captain";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const FinishRide = (props) => {
  const { ride } = props;
  const user = ride?.user || {};
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await finishRide(ride._id);
    if (response && response.ride) {
      toast("Ride finished successfully");
      navigate("/captain-home");
    }
  };
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl text-gray-600 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5 text-black">
        Finish this Ride
      </h3>
      <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-black border-2 border-gray-300 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user.fullname?.firstname?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>
          <h2 className="text-lg font-medium text-black capitalize">
            {user.fullname
              ? `${user.fullname.firstname} ${user.fullname.lastname}`
              : "Passenger Name"}
          </h2>
        </div>
        <h5 className="text-lg font-semibold text-black">
          {ride?.distance.distanceInKm || "0"} KM
        </h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="ri-map-pin-user-fill text-black"></i>
            <div>
              <h3 className="text-lg font-medium text-black">
                {ride?.pickup || "Pickup Location"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Pickup Address</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill text-black"></i>
            <div>
              <h3 className="text-lg font-medium text-black">
                {ride?.destination || "Destination"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Destination Address</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line text-black"></i>
            <div>
              <h3 className="text-lg font-medium text-black">
                ₹{ride?.fare || "0"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.paymentMethod || "Cash"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
          <button
            className="bg-black text-white font-semibold p-3 px-10 rounded-lg w-full hover:bg-gray-800 transition-colors"
            onClick={submitHandler}
          >
            Finish Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
