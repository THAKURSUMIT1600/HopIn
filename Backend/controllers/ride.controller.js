const rideService = require("../services/ride.service");
const Ride = require("../models/ride.model");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocket } = require("../socket");
module.exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    pickup,
    destination,
    vehicleType,
    fareAmount,
    selectedVehicleDistance,
    selectedVehicleDuration,
  } = req.body;

  try {
    // Create ride in DB
    const ride = await rideService.createRide({
      user: req.user._id.toString(),
      pickup,
      destination,
      vehicleType,
      fareAmount,
      selectedVehicleDistance,
      selectedVehicleDuration,
    });

    // Get coordinates
    const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // consider removing this in production
    const destinationCoordinates = await mapService.getAddressCoordinates(
      destination
    );

    // Calculate distance & nearby captains
    const distance = await mapService.getDistanceTime(
      pickupCoordinates,
      destinationCoordinates
    );
    const captains = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      50
    );

    if (!captains || captains.length === 0) {
      console.log("No captains found in the radius");
      return res.status(404).json({ error: "No captains available" });
    }

    // Filter captains by active status AND matching vehicle type
    const eligibleCaptains = captains.filter(
      (captain) =>
        captain.status === "active" &&
        captain.vehicle.vehicleType === vehicleType
    );

    if (!eligibleCaptains || eligibleCaptains.length === 0) {
      console.log(`No active captains found with vehicle type: ${vehicleType}`);
      return res.status(404).json({
        error: `No active captains available for ${vehicleType}`,
      });
    }

    // Optional: clean up sensitive ride fields
    ride.otp = "";

    // Populate user and attach distance
    const rideWithUser = await Ride.findById(ride._id).populate("user").lean();
    rideWithUser.distance = distance;

    // Send socket message only to eligible captains (active + matching vehicle type)
    eligibleCaptains.forEach((captain) => {
      console.log(
        `Sending new ride notification to captain: ${captain.socketId} (Vehicle: ${captain.vehicle.vehicleType})`
      );
      sendMessageToSocket(captain.socketId, "new-ride", rideWithUser);
    });

    console.log(
      `Ride created and sent to ${eligibleCaptains.length} eligible captains`
    );

    return res.status(201).json({ ride: rideWithUser });
  } catch (error) {
    console.error("❌ Error creating ride:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.getFare = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;
  console.log("Calculating fare for the following details:");
  console.log("Pickup:", pickup);
  console.log("Destination:", destination);

  try {
    const fares = await rideService.getFare(pickup, destination);
    return res.status(200).json({ fares });
  } catch (error) {
    console.error("Error calculating fare:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.confirmRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, captainId } = req.body;

  try {
    // Confirm the ride
    const ride = await rideService.confirmRide(rideId, captainId);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    console.log("Ride confirmed:", ride);
    sendMessageToSocket(ride.user.socketId, "ride-confirmed", ride);

    return res.status(200).json({ ride });
  } catch (error) {
    console.error("❌ Error confirming ride:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.startRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.body;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    console.log("Ride started:", ride);
    sendMessageToSocket(ride.user.socketId, "ride-started", ride);

    return res.status(200).json({ ride });
  } catch (error) {
    console.error("❌ Error starting ride:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

module.exports.finishRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.finishRide({ rideId, captain: req.captain });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    console.log("Ride finished:", ride);
    sendMessageToSocket(ride.user.socketId, "ride-finished", ride);

    return res.status(200).json({ ride });
  } catch (error) {
    console.error("❌ Error finishing ride:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};
