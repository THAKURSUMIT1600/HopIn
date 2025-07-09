import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Route,
  Home,
  User,
  Navigation,
} from "lucide-react";
import { getCaptainTripHistory } from "../redux/services/Captain";

function CaptainHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRide, setExpandedRide] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchCaptainTripHistory = async () => {
      try {
        setLoading(true);
        const response = await getCaptainTripHistory();
        console.log("Captain trip history response:", response);
        if (response && response.tripHistory) {
          setRides(response.tripHistory);
        } else {
          setRides([]);
        }
      } catch (error) {
        console.error("Error fetching captain trip history:", error);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptainTripHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      case "ongoing":
        return "text-blue-600";
      case "accepted":
        return "text-yellow-600";
      case "pending":
        return "text-gray-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "cancelled":
        return "bg-red-50 border-red-200";
      case "ongoing":
        return "bg-blue-50 border-blue-200";
      case "accepted":
        return "bg-yellow-50 border-yellow-200";
      case "pending":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (durationInSeconds) => {
    if (!durationInSeconds) return "N/A";

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getCustomerName = (user) => {
    if (!user) return "N/A";

    if (user.fullname) {
      const { firstname, lastname } = user.fullname;
      return `${firstname || ""} ${lastname || ""}`.trim() || "N/A";
    }

    return user.name || "N/A";
  };

  // Filter out pending and accepted rides from all filtering
  const validRides = rides.filter(
    (ride) => ride.status !== "pending" && ride.status !== "accepted"
  );

  const filteredRides = validRides.filter((ride) => {
    if (filter === "all") return true;
    return ride.status === filter;
  });

  const toggleExpanded = (rideId) => {
    setExpandedRide(expandedRide === rideId ? null : rideId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-lg sm:text-xl text-black">
            Loading ride history...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Captain History
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Track your rides and earnings
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/captain-home")}
              className="flex items-center space-x-2 bg-white text-black px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base flex-shrink-0 mt-3"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-black text-white p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold">
              {validRides.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Total Rides</div>
          </div>
          <div className="bg-black text-white p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold">
              {validRides.filter((r) => r.status === "completed").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Completed</div>
          </div>
          <div className="bg-black text-white p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold">
              ₹
              {validRides
                .filter((r) => r.status === "completed")
                .reduce((sum, r) => sum + (r.fare || 0), 0)
                .toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Total Earned</div>
          </div>
          <div className="bg-black text-white p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold">
              {validRides.filter((r) => r.status === "ongoing").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Ongoing</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-2">
            {["all", "completed", "ongoing", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors capitalize ${
                  filter === status
                    ? "bg-black text-white shadow-md"
                    : "text-black hover:bg-gray-200"
                }`}
              >
                <span className="hidden sm:inline">{status}</span>
                <span className="sm:hidden">
                  {status.charAt(0).toUpperCase()}
                </span>
                <span className="ml-1">
                  (
                  {
                    validRides.filter(
                      (r) => status === "all" || r.status === status
                    ).length
                  }
                  )
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rides List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredRides.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
              <Navigation className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg sm:text-xl text-gray-600 mb-2">
                No rides found
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                Your ride history will appear here
              </p>
            </div>
          ) : (
            filteredRides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Ride Summary Row */}
                <div
                  className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpanded(ride._id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    {/* Left Section - Status and Route */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1 min-w-0">
                      {/* Status Badge */}
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold border w-fit ${getStatusBg(
                          ride.status
                        )}`}
                      >
                        <span className={getStatusColor(ride.status)}>
                          {ride.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Route Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm">
                          <div className="flex items-center space-x-1 text-green-600 flex-shrink-0">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium">From:</span>
                          </div>
                          <span className="truncate text-black text-xs sm:text-sm">
                            {ride.pickup || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm">
                          <div className="flex items-center space-x-1 text-red-600 flex-shrink-0">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium">To:</span>
                          </div>
                          <span className="truncate text-black text-xs sm:text-sm">
                            {ride.destination || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Fare, Date, and Expand */}
                    <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                      {/* Fare */}
                      <div className="text-left sm:text-right">
                        <div className="text-lg sm:text-xl font-bold text-black">
                          ₹{ride.fare ? ride.fare.toLocaleString() : "0"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ride.distance
                            ? `${ride.distance.toFixed(1)} km`
                            : "N/A"}
                        </div>
                      </div>

                      {/* Date - Hidden on mobile, shown on larger screens */}
                      <div className="text-right text-sm text-gray-600 hidden lg:block">
                        <div>{formatDate(ride.createdAt).split(",")[0]}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(ride.createdAt).split(",")[1]}
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="p-1">
                        {expandedRide === ride._id ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Date */}
                  <div className="mt-2 text-xs text-gray-500 lg:hidden">
                    {formatDate(ride.createdAt)}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRide === ride._id && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                        {/* Customer & Trip Details */}
                        <div className="space-y-6">
                          {/* Customer Details */}
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4 flex items-center">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Customer Details
                            </h4>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                <span className="text-gray-600 text-sm">
                                  Customer Name:
                                </span>
                                <span className="font-medium text-black capitalize text-sm">
                                  {getCustomerName(ride.user)}
                                </span>
                              </div>
                              {ride.user?.email && (
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mt-2 pt-2 border-t">
                                  <span className="text-gray-600 text-sm">
                                    Email:
                                  </span>
                                  <span className="font-medium text-black text-xs sm:text-sm break-all sm:break-normal">
                                    {ride.user.email}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Trip Details */}
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4 flex items-center">
                              <Route className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Trip Details
                            </h4>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">
                                  Distance:
                                </span>
                                <span className="font-medium text-black text-sm">
                                  {ride.distance
                                    ? `${ride.distance.toFixed(1)} km`
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">
                                  Duration:
                                </span>
                                <span className="font-medium text-black text-sm">
                                  {formatDuration(ride.duration)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-3">
                                <span className="text-gray-600 font-medium text-sm">
                                  Total Fare:
                                </span>
                                <span className="text-lg sm:text-xl font-bold text-black">
                                  ₹
                                  {ride.fare ? ride.fare.toLocaleString() : "0"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Route & Timeline */}
                        <div className="space-y-6">
                          {/* Full Route */}
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4 flex items-center">
                              <Navigation className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Route Details
                            </h4>
                            <div className="space-y-3 sm:space-y-4">
                              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                                <div className="flex items-start space-x-3">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm font-medium text-green-600 mb-1">
                                      Pickup Location
                                    </div>
                                    <div className="text-black text-sm break-words">
                                      {ride.pickup || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                                <div className="flex items-start space-x-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm font-medium text-red-600 mb-1">
                                      Drop Location
                                    </div>
                                    <div className="text-black text-sm break-words">
                                      {ride.destination || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4 flex items-center">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              Timeline
                            </h4>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <span className="text-gray-600 text-sm">
                                    Created:
                                  </span>
                                </div>
                                <span className="font-medium text-black text-sm ml-6 sm:ml-0">
                                  {formatDate(ride.createdAt)}
                                </span>
                              </div>
                              {ride.completedAt && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-600 text-sm">
                                      Completed:
                                    </span>
                                  </div>
                                  <span className="font-medium text-black text-sm ml-6 sm:ml-0">
                                    {formatDate(ride.completedAt)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => (window.location.href = "/captain-home")}
            className="inline-flex items-center space-x-2 bg-black text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaptainHistory;
