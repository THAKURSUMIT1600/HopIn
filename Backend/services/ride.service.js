const Ride = require("../models/ride.model");
const mapService = require("./maps.service");
const crypto = require("crypto");

function getOtp(num) {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
  return otp;
}

async function getFare(pickupAddress, destinationAddress) {
  try {
    console.log("➡️ getFare called with:", {
      pickupAddress,
      destinationAddress,
    });

    if (!pickupAddress || !destinationAddress) {
      console.error("❌ Missing pickup or destination address.");
      throw new Error("Pickup and destination are required to calculate fare.");
    }

    // Step 1: Get coordinates for both addresses
    console.log("📍 Getting coordinates for pickup...");
    const pickup = await mapService.getAddressCoordinates(pickupAddress);
    console.log("✅ Pickup coordinates:", pickup);

    console.log("📍 Getting coordinates for destination...");
    const destination = await mapService.getAddressCoordinates(
      destinationAddress
    );
    console.log("✅ Destination coordinates:", destination);

    // Step 2: Get distance and time for all vehicle types
    console.log("🚗 Getting distance and time...");
    const vehicleData = await mapService.getDistanceTime(
      pickup,
      destination,
      true
    );
    console.log("✅ Vehicle data received:", vehicleData);

    if (
      !vehicleData ||
      !Array.isArray(vehicleData) ||
      vehicleData.length === 0
    ) {
      console.error("❌ Invalid vehicle data:", vehicleData);
      throw new Error("Unable to calculate fare due to invalid vehicle data.");
    }

    const rates = {
      auto: { perMeter: 0.01, perSecond: 0.033 },
      car: { perMeter: 0.015, perSecond: 0.05 },
      motorcycle: { perMeter: 0.008, perSecond: 0.025 },
    };

    const fares = {};

    console.log("💰 Calculating fares for each vehicle type...");
    // Process each vehicle type
    vehicleData.forEach((vehicle) => {
      const distanceKm = parseFloat(vehicle.distanceInKm);
      const durationMin = parseFloat(vehicle.durationInMin);

      if (isNaN(distanceKm) || isNaN(durationMin)) {
        console.warn(`⚠️ Invalid data for ${vehicle.vehicleType}:`, vehicle);
        return;
      }

      console.log(
        `📦 ${vehicle.vehicleType} - Distance: ${distanceKm} km, Duration: ${durationMin} min`
      );

      const distanceMeters = distanceKm * 1000;
      const durationSeconds = durationMin * 60;

      const vehicleRate = rates[vehicle.vehicleType];
      if (!vehicleRate) {
        console.warn(
          `⚠️ No rate found for vehicle type: ${vehicle.vehicleType}`
        );
        return;
      }

      fares[vehicle.vehicleType] = {
        fare: Math.round(
          distanceMeters * vehicleRate.perMeter +
            durationSeconds * vehicleRate.perSecond
        ),
        distanceKm,
        durationMin,
      };
    });

    console.log("✅ Fare calculation complete:", fares);
    return fares;
  } catch (err) {
    console.error("❌ Error in getFare:", err.message);
    throw new Error("Failed to calculate fare: " + err.message);
  }
}

module.exports.getFare = getFare;

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
  fareAmount,
  selectedVehicleDistance,
  selectedVehicleDuration,
}) => {
  if (
    !user ||
    !pickup ||
    !destination ||
    !vehicleType ||
    !selectedVehicleDistance ||
    !selectedVehicleDuration
  ) {
    throw new Error(
      "User, pickup, destination, and vehicle type are required."
    );
  }
  console.log("Creating ride with the following details:");
  console.log("User ID:", user);
  console.log("Pickup:", pickup);
  console.log("Destination:", destination);
  console.log("Vehicle Type:", vehicleType);
  console.log("Fare Amount:", fareAmount);

  const otp = getOtp(6);
  const ride = new Ride({
    user,
    pickup,
    destination,
    fare: fareAmount,
    otp,
    status: "pending",
    distance: selectedVehicleDistance,
    duration: selectedVehicleDuration,
  });

  await ride.save();

  return ride;
};

module.exports.confirmRide = async (rideId, captainId) => {
  if (!rideId || !captainId) {
    throw new Error("Ride ID and Captain ID must be provided.");
  }

  const update = await Ride.findByIdAndUpdate(
    { _id: rideId },
    {
      status: "accepted",
      captain: captainId,
    }
  );
  const ride = await Ride.findOne({
    _id: rideId,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  return ride;
};

module.exports.finishRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
    captain: captain._id,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
      completedAt: new Date(),
    }
  );

  return ride;
};

module.exports.cancelRide = async (rideId, userId) => {
  if (!rideId || !userId) {
    throw new Error("Ride ID and User ID are required.");
  }

  const ride = await Ride.findOne({
    _id: rideId,
    user: userId,
  });

  if (!ride) {
    throw new Error("Ride not found or you are not authorized to cancel it.");
  }

  if (ride.status === "completed") {
    throw new Error("Cannot cancel a completed ride.");
  }

  ride.status = "cancelled";
  await ride.save();

  return ride;
};
