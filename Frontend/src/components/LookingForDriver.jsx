import React from "react";

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

const LookingForDriver = (props) => {
  const { pickup, destination, fare, vehicleType, setVehicleFound } = props;

  const selectedVehicle = vehicles.find((v) => v.name === vehicleType);
  const vehicleImage =
    selectedVehicle?.image || "https://via.placeholder.com/150";
  const fareKey = selectedVehicle?.fareKey;
  const fareAmount = fare?.fares?.[fareKey]?.fare ?? "--";

  return (
    <div>
      <h5
        className="p-1 text-center w-[100%] absolute -top-8"
        onClick={() => {
          setVehicleFound(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img className="h-20" src={vehicleImage} alt={vehicleType} />
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
              <h3 className="text-lg font-medium">₹{fareAmount}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
