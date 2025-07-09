import React from "react";

const RidePopUp = (props) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto">
      <h3 className="text-2xl sm:text-2xl font-semibold mb-6 sm:mb-5 text-black font-serif text-left">
        New Ride Available
      </h3>
      <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-300 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black flex items-center justify-center text-white text-sm sm:text-lg font-semibold uppercase">
            {props?.rideData?.user?.fullname?.firstname?.[0] || "?"}
          </div>
          <h2 className="text-base sm:text-lg font-medium capitalize text-black">
            {props?.rideData?.user?.fullname?.firstname +
              " " +
              props?.rideData?.user?.fullname?.lastname}
          </h2>
        </div>
        <h5 className="text-base sm:text-lg font-semibold text-black">
          {props?.rideData?.distance?.distanceInKm + " Km"}
        </h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-4 sm:mt-5">
          <div className="flex items-center gap-3 sm:gap-5 p-3 border-b border-gray-300">
            <i className="ri-map-pin-user-fill text-black text-base sm:text-lg"></i>
            <div className="flex-1">
              <h3 className="text-sm sm:text-lg font-medium text-black break-words">
                {props?.rideData?.pickup}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 p-3 border-b border-gray-300">
            <i className="text-base sm:text-lg ri-map-pin-2-fill text-black"></i>
            <div className="flex-1">
              <h3 className="text-sm sm:text-lg font-medium text-black break-words">
                {props?.rideData?.destination}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 p-3">
            <i className="ri-currency-line text-black text-base sm:text-lg"></i>
            <div className="flex-1">
              <h3 className="text-sm sm:text-lg font-medium text-black">
                ₹{props?.rideData?.fare}
              </h3>
              <p className="text-xs sm:text-sm -mt-1 text-gray-600">
                Cash Payment
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-5 w-full space-y-2 sm:space-y-3">
          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide();
            }}
            className="bg-black hover:bg-gray-800 w-full text-white font-semibold p-3 sm:p-2 px-6 sm:px-10 rounded-lg transition-colors text-sm sm:text-base"
          >
            Accept
          </button>

          <button
            onClick={() => {
              props.setRidePopupPanel(false);
            }}
            className="w-full bg-white border-2 border-black text-black hover:bg-gray-100 font-semibold p-3 sm:p-2 px-6 sm:px-10 rounded-lg transition-colors text-sm sm:text-base"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
