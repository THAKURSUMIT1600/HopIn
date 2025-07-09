import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import Logo from "../assets/Logo.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerCaptain } from "../redux/services/Captain";
export default function CaptainSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitHandler = (data) => {
    const captainData = {
      fullname: {
        firstname: data.firstName,
        lastname: data.lastName,
      },
      email: data.email,
      password: data.password,
      vehicle: {
        color: data.vehicleColor,
        plate: data.vehiclePlate,
        capacity: data.vehicleCapacity,
        vehicleType: data.vehicleType,
      },
    };
    dispatch(registerCaptain(captainData))
      .unwrap()
      .then((res) => {
        navigate("/captain-home");
        reset();
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand Section */}
        <div className="flex justify-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-32 h-32 rounded-2xl object-cover"
          />
        </div>

        {/* Captain Signup Form */}
        <Card className="border border-gray-200 shadow-xl bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-black">
              Become a Captain
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Start earning by driving with HopIn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {"What's our Captain's name"}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      type="text"
                      placeholder="First name"
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 3,
                          message: "First name must be at least 3 characters",
                        },
                      })}
                      className="h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Last name"
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 3,
                          message: "Last name must be at least 3 characters",
                        },
                      })}
                      className="h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  {"What's our Captain's email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Vehicle Information
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      type="text"
                      placeholder="Vehicle Color"
                      {...register("vehicleColor", {
                        required: "Vehicle color is required",
                        minLength: {
                          value: 3,
                          message:
                            "Vehicle color must be at least 3 characters",
                        },
                      })}
                      className="h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    />
                    {errors.vehicleColor && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.vehicleColor.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Vehicle Plate"
                      {...register("vehiclePlate", {
                        required: "Vehicle plate is required",
                        minLength: {
                          value: 3,
                          message:
                            "Vehicle plate must be at least 3 characters",
                        },
                      })}
                      className="h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    />
                    {errors.vehiclePlate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.vehiclePlate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <Input
                      type="number"
                      placeholder="Vehicle Capacity"
                      {...register("vehicleCapacity", {
                        required: "Vehicle capacity is required",
                        min: {
                          value: 1,
                          message: "Vehicle capacity must be at least 1",
                        },
                      })}
                      className="h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black"
                    />
                    {errors.vehicleCapacity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.vehicleCapacity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      {...register("vehicleType", {
                        required: "Please select a vehicle type",
                      })}
                      className="h-11 w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-black"
                    >
                      <option value="" disabled>
                        Select Vehicle Type
                      </option>
                      <option value="car">Car</option>
                      <option value="auto">Auto</option>
                      <option value="moto">Moto</option>
                    </select>
                    {errors.vehicleType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.vehicleType.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    id="captain-terms"
                    {...register("terms", {
                      required:
                        "You must agree to the terms and privacy policy",
                    })}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="captain-terms" className="text-gray-600">
                    I agree to the Captain Terms and Privacy Policy
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs">{errors.terms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Create Captain Account
              </Button>
            </form>

            <div className="relative">
              <Separator className="my-4" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                OR
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600">
                Already have a captain account?{" "}
                <Link
                  to="/captain-login"
                  className="text-black hover:text-gray-700 font-semibold"
                >
                  Sign in here
                </Link>
              </p>

              <div className="text-center">
                <Link
                  to="/signup"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Looking to ride instead? Join as a passenger
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
