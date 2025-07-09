const Captain = require("../models/captain.model");
const Ride = require("../models/ride.model");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All Fields are Required");
  }
  const captain = Captain.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
  });
  return captain;
};

module.exports.calculateEarnings = async (captain) => {
  if (captain && captain._id) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const rides = await Ride.find({
      captain: captain._id,
      status: "completed",
      completedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const earnings = rides.reduce((total, ride) => total + ride.fare, 0);
    return earnings;
  }
};

module.exports.getTripHistory = async (captain) => {
  if (!captain || !captain._id) {
    throw new Error("Captain not found");
  }

  const rides = await Ride.find({ captain: captain._id })
    .populate("user")
    .populate("captain")
    .sort({ createdAt: -1 });

  return rides;
};
