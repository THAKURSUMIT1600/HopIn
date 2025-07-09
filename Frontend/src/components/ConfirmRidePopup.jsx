import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { startRide } from "../redux/services/Captain";
import { toast } from "sonner";
import { getSocket } from "../redux/services/Socket";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();
  const socket = getSocket();

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (data) => {
        const newMessage = {
          id: Date.now() + Math.random(),
          text: data.message,
          sender: "user", // Message from user/passenger
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("receive-message", handleReceiveMessage);

      // Cleanup function
      return () => {
        socket.off("receive-message", handleReceiveMessage);
      };
    }
  }, [socket, props?.rideData?.user?.socketId, props?.rideData?._id]);

  const handleSendMessage = () => {
    if (message.trim() && socket && props?.rideData?.user?.socketId) {
      // Send message via socket to backend
      socket.emit("message-send", {
        receiver: props.rideData.user.socketId,
        message: message.trim(),
      });

      // Add message to local state for immediate UI update
      const newMessage = {
        id: Date.now() + Math.random(),
        text: message.trim(),
        sender: "captain",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await startRide(props.rideData._id, otp);
      if (response && response.ride) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: props.rideData } });
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      // Show appropriate toast message based on the error
      if (err.message.includes("Invalid OTP")) {
        toast.error("Please enter correct OTP");
      } else if (err.message.includes("not authenticated")) {
        toast.error("Please login again");
      } else if (err.message.includes("not accepted")) {
        toast.error("Ride is not in accepted state");
      } else if (err.message.includes("not found")) {
        toast.error("Ride not found");
      } else {
        toast.error(err.message || "Failed to start ride");
      }
    }
  };

  // If message popup is open, show only the chat interface
  if (showMessagePopup) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col h-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMessagePopup(false)}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold uppercase">
                {props?.rideData?.user?.fullname?.firstname?.[0] || "?"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {props?.rideData?.user?.fullname?.firstname}{" "}
                  {props?.rideData?.user?.fullname?.lastname}
                </h3>
                <p className="text-sm text-gray-500">Passenger</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.sender === "captain" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.sender === "captain"
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-full transition-all duration-200 flex items-center justify-center"
            >
              <i className="ri-send-plane-line"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 max-w-md mx-auto">
      <h5
        className="p-2 text-center w-full absolute top-0 left-0"
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
      >
        <i className="text-2xl sm:text-3xl text-gray-600 ri-arrow-down-wide-line hover:text-black transition-colors"></i>
      </h5>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-black text-left mt-8 sm:mt-10">
        Confirm Ride to Start
      </h3>
      <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-black rounded-lg sm:rounded-xl mt-4 sm:mt-6 bg-gray-50 shadow-lg gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-black flex items-center justify-center text-white text-sm sm:text-xl font-bold uppercase shadow-lg flex-shrink-0">
            {props?.rideData?.user?.fullname?.firstname?.[0] || "?"}
          </div>
          <h2 className="text-sm sm:text-xl font-semibold capitalize text-black truncate">
            {props?.rideData?.user?.fullname?.firstname +
              " " +
              props?.rideData?.user?.fullname?.lastname}
          </h2>
        </div>
        <h5 className="text-sm sm:text-xl font-bold text-black bg-white px-2 sm:px-3 py-1 rounded-md sm:rounded-lg border border-black whitespace-nowrap flex-shrink-0">
          {props?.rideData?.distance?.distanceInKm + " Km"}
        </h5>
      </div>

      <div className="flex flex-col">
        <div className="w-full mt-4 sm:mt-6 bg-white border-2 border-black rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg">
          <div className="flex items-start gap-3 sm:gap-5 p-2 sm:p-4 border-b-2 border-gray-200">
            <i className="ri-map-pin-user-fill text-xl sm:text-2xl text-black mt-1 flex-shrink-0"></i>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                Pickup
              </p>
              <h3 className="text-sm sm:text-lg font-semibold text-black break-words">
                {props?.rideData?.pickup}
              </h3>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-5 p-2 sm:p-4 border-b-2 border-gray-200">
            <i className="text-xl sm:text-2xl ri-map-pin-2-fill text-black mt-1 flex-shrink-0"></i>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                Destination
              </p>
              <h3 className="text-sm sm:text-lg font-semibold text-black break-words">
                {props?.rideData?.destination}
              </h3>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-5 p-2 sm:p-4">
            <i className="ri-currency-line text-xl sm:text-2xl text-black mt-1 flex-shrink-0"></i>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                Fare
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-black">
                ₹ {props?.rideData?.fare}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Cash Payment</p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-8 w-full">
          <form onSubmit={submitHandler}>
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Enter OTP to Start Ride
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                className="bg-white border-2 border-black px-4 sm:px-6 py-3 sm:py-4 font-mono text-lg sm:text-xl rounded-lg sm:rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 sm:mt-6 text-lg sm:text-xl flex items-center justify-center bg-black text-white font-bold p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              <i className="ri-play-circle-line mr-2 text-xl sm:text-2xl"></i>
              Start Ride
            </button>
            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
                if (socket && props?.rideData?._id) {
                  socket.emit("ride-cancelled", {
                    rideId: props.rideData._id,
                    userId: props.rideData.user._id,
                    targetSocketId: props.rideData.user.socketId,
                    message: "Ride has been canceled by the captain",
                  });
                }
              }}
              className="w-full mt-3 sm:mt-4 bg-white border-2 border-black text-lg sm:text-xl text-black font-bold p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
            >
              <i className="ri-close-circle-line mr-2 text-xl sm:text-2xl"></i>
              Cancel Ride
            </button>
          </form>

          {/* Message Section */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black text-white rounded-lg sm:rounded-xl">
            <button
              onClick={() => setShowMessagePopup(true)}
              className="w-full flex items-center justify-center gap-3 text-white hover:bg-gray-800 transition-colors rounded-lg p-2"
            >
              <i className="ri-message-2-line text-xl"></i>
              <span className="font-bold text-base sm:text-lg">
                Message Passenger
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
