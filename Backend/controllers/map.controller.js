const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const coordinates = await mapService.getAddressCoordinates(address);

    if (!coordinates) {
      return res
        .status(404)
        .json({ error: "Coordinates not found for the address" });
    }

    return res.status(200).json({ coordinates });
  } catch (error) {
    console.error("Error getting coordinates:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "Origin and destination addresses are required" });
  }

  try {
    // Convert addresses to coordinates
    const originCoords = await mapService.getAddressCoordinates(origin);
    const destinationCoords = await mapService.getAddressCoordinates(
      destination
    );

    if (!originCoords || !destinationCoords) {
      return res.status(404).json({ error: "Unable to fetch coordinates" });
    }

    // Calculate distance and time
    const distanceTime = await mapService.getDistanceTime(
      originCoords,
      destinationCoords
    );

    if (!distanceTime) {
      return res
        .status(404)
        .json({ error: "Distance and time not found for the given locations" });
    }

    return res.status(200).json({ distanceTime });
  } catch (error) {
    console.error("Error getting distance and time:", error.message || error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const suggestions = await mapService.getAutocompleteSuggestions(input);

    if (!suggestions || suggestions.length === 0) {
      return res.status(404).json({ error: "No suggestions found" });
    }

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error getting autocomplete suggestions:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
