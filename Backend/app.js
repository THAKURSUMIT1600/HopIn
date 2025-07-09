const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectToDb = require("./db/db");
const cors = require("cors");
const userRoute = require("./routes/user.routes");
const captainRoute = require("./routes/captain.routes");
const mapRoute = require("./routes/map.routes");
const cookieParser = require("cookie-parser");
const rideRoute = require("./routes/ride.route");
connectToDb();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/users", userRoute);
app.use("/api/captain", captainRoute);
app.use("/api/maps", mapRoute);
app.use("/api/rides", rideRoute);

module.exports = app;
