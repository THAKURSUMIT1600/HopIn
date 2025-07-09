const User = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const BlacklistToken = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  const isUserAlreadyExist = await User.findOne({ email });
  if (isUserAlreadyExist) {
    res.status(400).json({ message: "User Already Exist" });
  }
  const hashedPassword = await User.hashPassword(password);
  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });
  const token = user.generateAuthToken();
  res.cookie("token", token, { httpOnly: true });
  return res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const token = user.generateAuthToken();
  res.cookie("token", token, { httpOnly: true });

  const userObj = user.toObject();
  delete userObj.password;
  return res.status(200).json({ token, user: userObj });
};

module.exports.getUserProfile = async (req, res, next) => {
  return res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res, next) => {
  const token =
    req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];

  res.clearCookie("token");
  await BlacklistToken.create({ token });
  return res.status(200).json({ message: "Logout Successfully" });
};
