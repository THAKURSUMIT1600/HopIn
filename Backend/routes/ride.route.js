const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/create-ride", [
  authMiddleware.authUser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Pickup location is required"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Destination is required"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "motorcycle"])
    .withMessage("Vehicle type must be one of: auto, car, motorcycle"),
  body("selectedVehicleDistance")
    .isNumeric()
    .withMessage("Selected vehicle distance is required"),
  body("selectedVehicleDuration")
    .isNumeric()
    .withMessage("Selected vehicle duration is required"),
  rideController.createRide,
]);

router.get("/get-fare", [
  authMiddleware.authUser,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  rideController.getFare,
]);

router.post("/confirm-ride", [
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  body("captainId").isMongoId().withMessage("Invalid captain ID"),
  rideController.confirmRide,
]);

router.post("/start-ride", [
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  body("otp")
    .isString()
    .isLength({ min: 4, max: 6 })
    .withMessage("Invalid OTP"),
  rideController.startRide,
]);

router.post("/finish-ride", [
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.finishRide,
]);

module.exports = router;
