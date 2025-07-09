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
import { loginCaptain } from "../redux/services/Captain";
import { useNavigate } from "react-router-dom";

export default function CaptainLogin() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (data) => {
    setIsLoading(true);
    setLoginError(""); // Clear previous errors

    const captainData = {
      email: data.email,
      password: data.password,
    };

    dispatch(loginCaptain(captainData))
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

        {/* Captain Login Form */}
        <Card className="border border-gray-200 shadow-xl bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-black">
              Captain Sign In
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Access your captain dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display login error */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  {"What's your email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email", { required: "Email is required" })}
                  className={`h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
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
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`h-11 bg-gray-50 border-gray-300 focus:border-black focus:ring-black ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    {...register("remember", {
                      required: "You must agree to remember me",
                    })}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="remember" className="text-gray-600">
                    Remember me
                  </label>
                </div>
              </div>
              {errors.remember && (
                <p className="text-red-500 text-xs">
                  {errors.remember.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Signing In..." : "Sign In"}
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
                Join the fleet?{" "}
                <Link
                  to="/captain-signup"
                  className="text-black hover:text-gray-700 font-semibold"
                >
                  Register as a Captain
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Login Option */}
        <Card className="border border-gray-200 shadow-lg bg-white">
          <CardContent className="p-4">
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full h-12 bg-gray-900 hover:bg-black text-white border-gray-900 hover:border-black hover:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign in as User</span>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <p>© 2024 HopIn. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
