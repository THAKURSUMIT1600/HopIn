"use client";

import React from "react";
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
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import Logo from "../assets/Logo.png";
import { registerUser } from "../redux/services/User";
import { useDispatch } from "react-redux";
export default function UserSignup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (data) => {
    const userData = {
      fullname: {
        firstname: data.firstName,
        lastname: data.lastName,
      },
      email: data.email,
      password: data.password,
    };
    dispatch(registerUser(userData))
      .unwrap()
      .then((res) => {
        navigate("/home");
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

        {/* Signup Form */}
        <Card className="border border-gray-200 shadow-xl bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-black">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {"What's your name"}
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
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
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
                <div className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("terms", {
                      required: "You must agree to the terms and conditions",
                    })}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the Terms of Service and Privacy Policy
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
                Create Account
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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-black hover:text-gray-700 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
