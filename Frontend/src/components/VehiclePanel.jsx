import React from "react";

const VehiclePanel = ({
  fare = {},
  setVehiclePanel,
  setVehicleType,
  setConfirmRidePanel,
  setSelectedVehicleDistance,
  setSelectedVehicleDuration,
}) => {
  // Handle both fare structures: direct fare object or nested fares object
  const fareData = fare.fares || fare;
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

  const getFareForVehicle = (fareKey) => {
    const vehicleData = fareData[fareKey];
    return vehicleData?.fare ? `₹${vehicleData.fare}` : "N/A";
  };

  const getVehicleData = (fareKey) => {
    return fareData[fareKey] || {};
  };

  const handleVehicleSelect = (vehicle) => {
    const vehicleData = getVehicleData(vehicle.fareKey);

    setVehicleType(vehicle.name);

    // Set the selected vehicle distance and duration from the fare data
    if (vehicleData.distanceKm) {
      setSelectedVehicleDistance(vehicleData.distanceKm);
    }

    if (vehicleData.durationMin) {
      setSelectedVehicleDuration(vehicleData.durationMin);
    }

    setConfirmRidePanel(true);
  };

  return (
    <div className="relative bg-white rounded-t-xl p-3 sm:p-4 lg:p-6 shadow-2xl border-t border-gray-200 max-h-[85vh] overflow-y-auto">
      <button
        className="p-1 text-center w-full absolute top-0 left-0 hover:bg-gray-50 rounded-t-xl transition-colors z-10"
        onClick={() => setVehiclePanel(false)}
        aria-label="Close vehicle panel"
      >
        <i className="text-2xl sm:text-3xl text-gray-400 ri-arrow-down-wide-line hover:text-gray-600 transition-colors"></i>
      </button>

      <div className="mt-6 sm:mt-8">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center text-black px-4">
          Choose a Vehicle
        </h3>

        <div className="space-y-2 sm:space-y-3">
          {vehicles.map((vehicle) => {
            const vehicleData = getVehicleData(vehicle.fareKey);

            return (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleSelect(vehicle)}
                className="flex border-2 border-gray-200 active:border-black rounded-xl w-full p-3 sm:p-4 items-center justify-between cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-lg flex items-center justify-center p-1 sm:p-2 flex-shrink-0">
                    <img
                      className="h-8 w-8 sm:h-12 sm:w-12 object-contain"
                      src={vehicle.image}
                      alt={vehicle.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                      <h4 className="font-bold text-base sm:text-lg lg:text-xl text-black truncate">
                        {vehicle.name}
                      </h4>
                      <span className="flex items-center text-xs sm:text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                        <i className="ri-user-3-fill mr-1"></i>
                        {vehicle.capacity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2 flex-wrap">
                      {vehicleData.distanceKm && (
                        <span className="text-xs sm:text-sm text-gray-700 font-medium flex items-center">
                          <i className="ri-map-pin-line mr-1"></i>
                          {vehicleData.distanceKm} km
                        </span>
                      )}
                      {vehicleData.durationMin && (
                        <span className="text-xs sm:text-sm text-gray-700 font-medium flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {Math.round(vehicleData.durationMin)} min
                        </span>
                      )}
                    </div>

                    <p className="font-normal text-xs sm:text-sm text-gray-500 line-clamp-2">
                      {vehicle.description}
                    </p>
                  </div>
                </div>

                <div className="text-right ml-2 sm:ml-4 flex-shrink-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-1">
                    {getFareForVehicle(vehicle.fareKey)}
                  </h2>
                  {vehicleData.fare && (
                    <div className="inline-flex items-center bg-black text-white text-xs font-medium px-2 py-1 rounded-full">
                      <i className="ri-price-tag-3-line mr-1 hidden sm:inline"></i>
                      <span className="hidden sm:inline">Best Price</span>
                      <span className="sm:hidden">Best</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600 text-center">
            <i className="ri-information-line mr-2 flex-shrink-0"></i>
            <span>Prices may vary based on traffic and demand</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePanel;
