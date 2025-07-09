// src/redux/features/user/userThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
// const dispatch = useDispatch();
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/users/register`,
        userData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        const {
          fullname: { firstname, lastname },
          email,
          _id,
        } = response.data.user;

        toast.success("Registered & Logged in successfully!");
        return { firstname, lastname, email, _id };
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

export const loginUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/users/login`,
        loginData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Logged in successfully!");
        localStorage.setItem("token", response.data.token);
        const {
          fullname: { firstname, lastname },
          email,
          _id,
        } = response.data.user;
        return { firstname, lastname, email, _id };
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

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}api/users/logout`, {
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

export const loadUserProfile = createAsyncThunk(
  "user/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const {
          fullname: { firstname, lastname },
          email,
          _id,
        } = response.data.user;

        return { firstname, lastname, email, _id };
      } else {
        const message = response.data?.message || "Failed to load profile.";
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      let errMsg = "Unable to fetch user profile. Please login again.";

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

export const getSuggestions = async (input) => {
  if (!input || typeof input !== "string") {
    throw new Error("Input must be a non-empty string.");
  }

  try {
    const response = await axios.get(`${BASE_URL}api/maps/get-suggestions`, {
      params: { input },
    });

    if (response.status === 200 && Array.isArray(response.data.suggestions)) {
      return response.data.suggestions;
    } else {
      throw new Error("Failed to fetch suggestions.");
    }
  } catch (error) {
    const message =
      error.response?.data?.message || "Error fetching location suggestions.";
    throw new Error(message);
  }
};

export const getFareEstimate = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Both pickup and destination must be provided.");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}api/rides/get-fare`,
      {
        params: {
          pickup,
          destination,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 && response.data) {
      console.log("Fare estimate response:", response.data);
      return response.data;
    } else {
      throw new Error("Failed to fetch fare estimate.");
    }
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error fetching fare estimate.";
    throw new Error(message);
  }
};

export const createRide = async (
  pickup,
  destination,
  vehicleType,
  fareAmount,
  selectedVehicleDistance,
  selectedVehicleDuration
) => {
  if (
    !pickup ||
    !destination ||
    !vehicleType ||
    !fareAmount ||
    !selectedVehicleDistance ||
    !selectedVehicleDuration
  ) {
    throw new Error(
      "Pickup, destination,FareAmount and vehicle type must be provided."
    );
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}api/rides/create-ride`,
      {
        pickup,
        destination,
        vehicleType: vehicleType.toLowerCase(),
        fareAmount,
        selectedVehicleDistance,
        selectedVehicleDuration,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      console.log("Ride created response:", response.data.ride);
      return response.data.ride;
    } else {
      throw new Error("Failed to create ride.");
    }
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Error creating ride.";
    throw new Error(message);
  }
};
