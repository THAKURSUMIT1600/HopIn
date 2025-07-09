import React, { useState } from "react";

const ConfirmRide = (props) => {
  const {
    pickup,
    destination,
    vehicleType,
    fare,
    setConfirmRidePanel,
    setVehicleFound,
    createRide,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const small = vehicleType.toLowerCase();
  const vehicles = [
    {
      id: "car",
      name: "Car",
      image:
        "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    },
    {
      id: "motorcycle",
      name: "Motorcycle",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    },
    {
      id: "auto",
      name: "Auto",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
    },
  ];

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleConfirmRide = async () => {
    setIsLoading(true);
    try {
      const result = await createRide();
      if (result) {
        setVehicleFound(true);
        setConfirmRidePanel(false);
        showToast("Ride confirmed successfully!", "success");
      } else {
        showToast(
          result?.message || "Failed to create ride. Please try again.",
          "error"
        );
      }
    } catch (error) {
      showToast(
        error.message || "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {}
      {toast.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <i
              className={`${
                toast.type === "success"
                  ? "ri-check-circle-line"
                  : "ri-error-warning-line"
              }`}
            ></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <button
        className="p-1 text-center w-full absolute -top-7 left-0 hover:bg-gray-50 rounded-t-xl transition-colors z-10"
        onClick={() => setConfirmRidePanel(false)}
        aria-label="Close vehicle panel"
      >
        <i className="text-2xl sm:text-3xl text-gray-400 ri-arrow-down-wide-line hover:text-gray-600 transition-colors"></i>
      </button>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          className="h-20"
          src={vehicles.find((c) => c.name == vehicleType)?.image}
          alt=""
        />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{pickup}</h3>
              <p className="text-sm -mt-1 text-gray-600">Pick-up Location</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{destination}</h3>
              <p className="text-sm -mt-1 text-gray-600">Destination</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{fare ? fare?.fares?.[small]?.fare : "--"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleConfirmRide}
          disabled={isLoading}
          className={`w-full mt-5 font-semibold p-2 rounded-lg transition-all duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-black"
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Confirming...</span>
            </div>
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
