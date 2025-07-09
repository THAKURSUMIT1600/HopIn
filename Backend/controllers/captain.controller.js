const Captain = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const BlacklistToken = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;
  const isCaptainAlreadyExist = await Captain.findOne({ email });
  if (isCaptainAlreadyExist) {
    res.status(400).json({ message: "Captain Already Exist" });
  }
  const hashedPassword = await Captain.hashPassword(password);
  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });
  const token = captain.generateAuthToken();
  res.cookie("token", token);
  return res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const token = captain.generateAuthToken();
  res.cookie("token", token);
  const capObj = captain.toObject();
  delete capObj.password;
  return res.status(200).json({ token, captain: capObj });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  return res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token =
    req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];

  await BlacklistToken.create({ token });
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout Successfully" });
};
const jwt = require("jsonwebtoken");

module.exports.updateStatus = async (req, res, next) => {
  const captain = req.captain;
  const errors = validationResult(req);
  console.log("Updating captain status for:", captain);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }

  try {
    // Find the captain by ID first
    const foundCaptain = await Captain.findById(captain._id).populate(
      "vehicle"
    );

    if (!foundCaptain) {
      return res.status(404).json({ message: "Captain not found in database" });
    }

    foundCaptain.status =
      foundCaptain.status === "active" ? "inactive" : "active";

    // Save the updated captain
    await foundCaptain.save();

    return res.status(200).json({
      fullname: {
        firstname: foundCaptain.fullname.firstname,
        lastname: foundCaptain.fullname.lastname,
      },
      email: foundCaptain.email,
      status: foundCaptain.status,
      _id: foundCaptain._id,
      vehicle: {
        color: foundCaptain.vehicle.color,
        plate: foundCaptain.vehicle.plate,
        capacity: foundCaptain.vehicle.capacity,
        vehicleType: foundCaptain.vehicle.vehicleType,
      },
      message: `Captain status updated to ${foundCaptain.status}`,
      isActive: foundCaptain.status === "active",
    });
  } catch (error) {
    console.error("Error updating captain status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getEarnings = async (req, res, next) => {
  const captain = req.captain;
  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }

  try {
    const earnings = await captainService.calculateEarnings(captain);
    return res.status(200).json({ earnings });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getTripHistory = async (req, res, next) => {
  const captain = req.captain;
  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }

  try {
    const tripHistory = await captainService.getTripHistory(captain);
    return res.status(200).json({ tripHistory });
  } catch (error) {
    console.error("Error fetching trip history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
