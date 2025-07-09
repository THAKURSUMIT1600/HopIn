// src/redux/features/captain/captainThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerCaptain = createAsyncThunk(
  "captain/register",
  async (captainData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/captain/register`,
        captainData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        const {
          captain: {
            fullname: { firstname, lastname },
            email,
            _id,
            status,
            vehicle: { color, plate, capacity, vehicleType },
          },
        } = response.data;

        console.log("Captain Data:", response.data);
        toast.success("Registered & Logged in successfully!");
        return {
          firstname,
          lastname,
          email,
          _id,
          status,
          vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
          },
        };
      } else {
        const message = response.data?.message || "Registration failed.";
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      let errMsg = "Something went wrong. Please try again later.";
      const responseData = error.response?.data;

      if (
        Array.isArray(responseData?.errors) &&
        responseData.errors.length > 0
      ) {
        errMsg = responseData.errors[0].msg;
      } else if (responseData?.message) {
        errMsg = responseData.message;
      }

      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const loginCaptain = createAsyncThunk(
  "captain/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/captain/login`,
        loginData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Logged in successfully!");
        localStorage.setItem("token", response.data.token);
        const {
          token,
          captain: {
            fullname: { firstname, lastname },
            email,
            _id,
            status,
            vehicle: { color, plate, capacity, vehicleType },
          },
        } = response.data;
        console.log("Captain Data:", response.data);

        return {
          firstname,
          lastname,
          email,
          _id,
          status,
          vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
          },
        };
      } else {
        const message = response.data?.message || "Login failed.";
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      let errMsg = "Something went wrong. Please try again later.";
      const responseData = error.response?.data;

      if (
        Array.isArray(responseData?.errors) &&
        responseData.errors.length > 0
      ) {
        errMsg = responseData.errors[0].msg;
      } else if (responseData?.message) {
        errMsg = responseData.message;
      }

      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const loadCaptainProfile = createAsyncThunk(
  "captain/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}api/captain/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const {
          token,
          captain: {
            fullname: { firstname, lastname },
            email,
            status,
            _id,
            vehicle: { color, plate, capacity, vehicleType },
          },
        } = response.data;

        return {
          firstname,
          lastname,
          email,
          _id,
          status,
          vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
          },
        };
      } else {
        const message = response.data?.message || "Failed to load profile.";
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      let errMsg = "Unable to fetch captain profile. Please login again.";

      const responseData = error.response?.data;

      if (
        Array.isArray(responseData?.errors) &&
        responseData.errors.length > 0
      ) {
        errMsg = responseData.errors[0].msg;
      } else if (responseData?.message) {
        errMsg = responseData.message;
      }

      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const logoutCaptain = createAsyncThunk(
  "captain/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}api/captain/logout`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        return null;
      } else {
        const message = response.data?.message || "Logout failed.";
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      const responseData = error.response?.data;
      const errMsg =
        responseData?.message || "Something went wrong during logout.";

      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const updateCaptainProfile = createAsyncThunk(
  "captain/updateProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("User is not authenticated.");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/captain/update-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const {
          token,
          captain: {
            fullname: { firstname, lastname },
            email,
            status,
            _id,
            vehicle: { color, plate, capacity, vehicleType },
          },
        } = response.data;

        return {
          firstname,
          lastname,
          email,
          _id,
          status,
          vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
          },
        };
      }

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error updating captain profile.";

      return rejectWithValue(message);
    }
  }
);

export const confirmRide = async (rideId, captainId) => {
  if (!rideId || !captainId) {
    throw new Error("Ride ID and Captain ID must be provided.");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}api/rides/confirm-ride`,
      {
        rideId,
        captainId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // You can access response.data.ride if needed
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error confirming ride.";
    throw new Error(message);
  }
};

export const startRide = async (rideId, otp) => {
  if (!rideId || !otp) {
    throw new Error("Ride ID and OTP must be provided.");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}api/rides/start-ride`,
      {
        rideId,
        otp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // e.g., response.data.ride if needed
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error starting ride.";
    throw new Error(message);
  }
};

export const finishRide = async (rideId) => {
  if (!rideId) {
    throw new Error("Ride ID must be provided.");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}api/rides/finish-ride`,
      {
        rideId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error finishing ride.";
    throw new Error(message);
  }
};

export const getCaptainEarnings = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}api/captain/earnings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error fetching earnings.";
    throw new Error(message);
  }
};

export const getCaptainTripHistory = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}api/captain/trip-history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error fetching trip history.";
    throw new Error(message);
  }
};
