const axios = require("axios");
const Captain = require("../models/captain.model");

module.exports.getAddressCoordinates = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }

  const apiKey = process.env.LOCATIONIQ_API_KEY; // Make sure this is set in your .env

  const url = "https://us1.locationiq.com/v1/search.php";

  const response = await axios.get(url, {
    params: {
      key: apiKey,
      q: address,
      format: "json",
      limit: 1,
    },
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("Unable to fetch coordinates for the given address");
  }

  const location = response.data[0];

  return {
    lat: parseFloat(location.lat),
    lng: parseFloat(location.lon),
    display_name: location.display_name,
  };
};
module.exports.getDistanceTime = async (
  origin,
  destination,
  vehicleType = false
) => {
  console.log("=== getDistanceTime called ===");
  console.log("Origin:", origin);
  console.log("Destination:", destination);
  console.log("VehicleType:", vehicleType);

  if (!origin || !destination) {
    console.error("Missing origin or destination");
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.LOCATIONIQ_API_KEY;
  console.log("API Key exists:", !!apiKey);

  const originStr = `${origin.lng},${origin.lat}`;
  const destinationStr = `${destination.lng},${destination.lat}`;
  console.log("Origin string:", originStr);
  console.log("Destination string:", destinationStr);

  // If no vehicleType provided, use default driving
  if (!vehicleType) {
    console.log("Using default driving route");
    const url = `https://us1.locationiq.com/v1/directions/driving/${originStr};${destinationStr}`;
    console.log("Default URL:", url);

    try {
      const response = await axios.get(url, {
        params: {
          key: apiKey,
          alternatives: false,
          steps: false,
          annotations: true,
        },
      });

      console.log("Default response status:", response.status);
      console.log("Default response data keys:", Object.keys(response.data));

      if (
        !response.data ||
        !response.data.routes ||
        response.data.routes.length === 0
      ) {
        console.error("Invalid default response data:", response.data);
        throw new Error("Unable to fetch distance and time from LocationIQ");
      }

      const route = response.data.routes[0];
      console.log("Default route data:", {
        distance: route.distance,
        duration: route.duration,
      });

      const result = {
        distanceInKm: (route.distance / 1000).toFixed(2),
        durationInMin: (route.duration / 60).toFixed(2),
      };
      console.log("Default result:", result);
      return result;
    } catch (error) {
      console.error("Error in default route:", error.message);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      }
      throw error;
    }
  }

  // Helper function to add delay between API calls
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // If vehicleType is true, return data for all vehicle types
  if (vehicleType === true) {
    console.log("Getting data for all vehicle types");
    const vehicleTypes = ["car", "auto", "motorcycle"];
    const results = [];

    for (let i = 0; i < vehicleTypes.length; i++) {
      const vType = vehicleTypes[i];

      // Add delay between requests (except for the first one)
      if (i > 0) {
        console.log(`Waiting 8 seconds before processing ${vType}...`);
        await delay(8000); // 8 second delay
      }
      console.log(`\n--- Processing vehicle type: ${vType} ---`);

      // Fixed vehicle profiles - all use 'driving' profile
      const vehicleProfiles = {
        car: "driving",
        auto: "driving",
        motorcycle: "driving", // Changed from "cycling" to "driving"
      };

      const profile = vehicleProfiles[vType] || "driving";
      console.log(`Profile for ${vType}:`, profile);

      const url = `https://us1.locationiq.com/v1/directions/${profile}/${originStr};${destinationStr}`;
      console.log(`URL for ${vType}:`, url);

      try {
        const response = await axios.get(url, {
          params: {
            key: apiKey,
            alternatives: false,
            steps: false,
            annotations: true,
          },
        });

        console.log(`${vType} response status:`, response.status);
        console.log(`${vType} response data keys:`, Object.keys(response.data));

        if (
          !response.data ||
          !response.data.routes ||
          response.data.routes.length === 0
        ) {
          console.error(`Invalid ${vType} response data:`, response.data);
          throw new Error(
            `Unable to fetch distance and time for ${vType} from LocationIQ`
          );
        }

        const route = response.data.routes[0];
        console.log(`${vType} raw route data:`, {
          distance: route.distance,
          duration: route.duration,
        });

        // Apply vehicle-specific adjustments
        let adjustedDuration = route.duration;
        let adjustedDistance = route.distance;

        switch (vType) {
          case "motorcycle":
            // Motorcycles are faster due to lane splitting and maneuverability
            adjustedDuration = route.duration * 0.7; // Reduced from 0.3 to be more realistic
            console.log(
              `${vType} duration adjusted: ${route.duration} -> ${adjustedDuration}`
            );
            break;
          case "auto":
            // Auto-rickshaws are slower due to traffic restrictions and lower speed
            adjustedDuration = route.duration * 1.2;
            console.log(
              `${vType} duration adjusted: ${route.duration} -> ${adjustedDuration}`
            );
            break;
          case "car":
          default:
            console.log(`${vType} duration unchanged:`, adjustedDuration);
            break;
        }

        const vehicleResult = {
          vehicleType: vType,
          distanceInKm: (adjustedDistance / 1000).toFixed(2),
          durationInMin: (adjustedDuration / 60).toFixed(2),
        };

        console.log(`${vType} final result:`, vehicleResult);
        results.push(vehicleResult);

        // Add delay after successful request (except for the last one)
        if (i < vehicleTypes.length - 1) {
          console.log(
            `Request completed for ${vType}, waiting 3 seconds before next request...`
          );
          await delay(3000); // 3 second additional delay after successful request
        }
      } catch (error) {
        console.error(`Error processing ${vType}:`, error.message);
        if (error.response) {
          console.error(
            `${vType} error response status:`,
            error.response.status
          );
          console.error(`${vType} error response data:`, error.response.data);

          // If it's a rate limit error, wait longer before retrying
          if (error.response.status === 429) {
            console.log(`Rate limit hit for ${vType}, waiting 5 seconds...`);
            await delay(5000); // 5 second delay for rate limit errors
          }
        }
        throw error;
      }
    }

    console.log("\n=== All vehicle types processed ===");
    console.log("Final results array:", results);
    return results;
  }

  // Handle single vehicle type
  console.log(`Processing single vehicle type: ${vehicleType}`);

  // Fixed vehicle profiles - all use 'driving' profile
  const vehicleProfiles = {
    car: "driving",
    auto: "driving",
    motorcycle: "driving", // Changed from "cycling" to "driving"
  };

  const profile = vehicleProfiles[vehicleType] || "driving";
  console.log(`Profile for ${vehicleType}:`, profile);

  const url = `https://us1.locationiq.com/v1/directions/${profile}/${originStr};${destinationStr}`;
  console.log(`Single vehicle URL:`, url);

  try {
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        alternatives: false,
        steps: false,
        annotations: true,
      },
    });

    console.log(`${vehicleType} response status:`, response.status);
    console.log(
      `${vehicleType} response data keys:`,
      Object.keys(response.data)
    );

    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      console.error(`Invalid ${vehicleType} response data:`, response.data);
      throw new Error("Unable to fetch distance and time from LocationIQ");
    }

    const route = response.data.routes[0];
    console.log(`${vehicleType} raw route data:`, {
      distance: route.distance,
      duration: route.duration,
    });

    // Apply vehicle-specific adjustments
    let adjustedDuration = route.duration;
    let adjustedDistance = route.distance;

    switch (vehicleType) {
      case "motorcycle":
        // Motorcycles are faster due to lane splitting and maneuverability
        adjustedDuration = route.duration * 0.7; // Reduced from 0.3 to be more realistic
        console.log(
          `${vehicleType} duration adjusted: ${route.duration} -> ${adjustedDuration}`
        );
        break;
      case "auto":
        // Auto-rickshaws are slower due to traffic restrictions and lower speed
        adjustedDuration = route.duration * 1.2;
        console.log(
          `${vehicleType} duration adjusted: ${route.duration} -> ${adjustedDuration}`
        );
        break;
      case "car":
      default:
        console.log(`${vehicleType} duration unchanged:`, adjustedDuration);
        break;
    }

    const result = {
      distanceInKm: (adjustedDistance / 1000).toFixed(2),
      durationInMin: (adjustedDuration / 60).toFixed(2),
    };

    console.log(`${vehicleType} final result:`, result);
    console.log("=== getDistanceTime completed ===\n");

    return result;
  } catch (error) {
    console.error(
      `Error processing single vehicle ${vehicleType}:`,
      error.message
    );
    if (error.response) {
      console.error(
        `${vehicleType} error response status:`,
        error.response.status
      );
      console.error(`${vehicleType} error response data:`, error.response.data);
    }
    throw error;
  }
};

module.exports.getAutocompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Input is required for autocomplete suggestions");
  }
  const apiKey = process.env.LOCATIONIQ_API_KEY; // Ensure this is set in your .env
  const url = "https://us1.locationiq.com/v1/autocomplete.php";
  const response = await axios.get(url, {
    params: {
      key: apiKey,
      q: input,
      format: "json",
      limit: 5, // Limit the number of suggestions
    },
  });
  if (!response.data || response.data.length === 0) {
    throw new Error("No suggestions found for the input");
  }
  return response.data;
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  const captains = await Captain.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  });

  return captains;
};
