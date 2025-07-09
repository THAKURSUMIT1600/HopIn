import React, { useState, useEffect, useRef } from "react";
import { getSocket } from "../redux/services/Socket";

const WaitingForDriver = ({ ride, waitingForDriver, vehicleType }) => {
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const captain = ride?.captain;
  const pickup = ride?.pickup;
  const destination = ride?.destination;
  const fare = ride?.fare;

  // Socket listeners for real-time messaging
  useEffect(() => {
    if (socket && captain?.socketId) {
      const handleReceiveMessage = (data) => {
        const newMessage = {
          id: Date.now() + Math.random(),
          text: data.message,
          sender: "driver", // Message from captain/driver
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      const handleMessageSent = () => {
        setIsSending(false);
      };

      const handleMessageError = () => {
        setIsSending(false);
      };

      // Register event listeners
      socket.on("receive-message", handleReceiveMessage);
      socket.on("message-sent", handleMessageSent);
      socket.on("message-error", handleMessageError);

      // Cleanup function
      return () => {
        socket.off("receive-message", handleReceiveMessage);
        socket.off("message-sent", handleMessageSent);
        socket.off("message-error", handleMessageError);
      };
    }
  }, [socket, captain?.socketId, ride?._id]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const vehicles = [
    {
      id: "Car",
      name: "Car",
      capacity: 4,
      description: "Affordable, compact rides",
      image:
        "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
      fareKey: "car",
    },
    {
      id: "MotorCycle",
      name: "Motorcycle",
      capacity: 1,
      description: "Affordable motorcycle rides",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
      fareKey: "motorcycle",
    },
    {
      id: "Auto",
      name: "Auto",
      capacity: 3,
      description: "Affordable Auto rides",
      image:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
      fareKey: "auto",
    },
  ];

  const selectedVehicle = vehicles.find((v) => v.name === vehicleType);
  const vehicleImage =
    selectedVehicle?.image || "https://via.placeholder.com/150";

  const handleSendMessage = () => {
    if (
      message.trim() &&
      socket &&
      captain?.socketId &&
      !isSending &&
      socket.connected
    ) {
      setIsSending(true);

      const messageText = message.trim();
      const newMessage = {
        id: Date.now() + Math.random(),
        text: messageText,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("message-send", {
        message: messageText,
        receiver: captain?.socketId,
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");

      // Reset sending state after a short delay if no confirmation received
      setTimeout(() => setIsSending(false), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-24 h-24 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center p-1 sm:p-2 flex-shrink-0">
          <img
            className="h-24 w-24 object-contain"
            src={vehicleImage}
            alt={vehicleType}
          />
        </div>
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {captain?.vehicle?.plate || "N/A"}
          </h4>
          <p className="text-sm text-gray-600 capitalize">
            {captain?.vehicle?.vehicleType} - {captain?.vehicle?.color}
          </p>
          <div className="mt-3">
            <p className="text-lg font-medium">OTP: {ride?.otp || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Message Icon */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowMessagePopup(true)}
          className="bg-black text-white p-3 rounded-full shadow-lg transition-all duration-200"
        >
          Message Driver
        </button>
      </div>

      {/* Message Popup */}
      {showMessagePopup && (
        <div className="fixed inset-0 bg-transparent bg-opacity-90 flex items-center justify-center z-50 w-full">
          <div className="bg-white rounded-lg p-4 w-full h-[90%] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {captain?.fullname?.firstname?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold capitalize text-black">
                    {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                  </h3>
                  <p className="text-sm text-gray-400">Captain</p>
                </div>
              </div>
              <button
                onClick={() => setShowMessagePopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-4 max-h-64">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
                className={`text-white px-4 py-2 rounded-lg transition-all duration-200 ${
                  isSending || !message.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {isSending ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className="ri-send-plane-line"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{pickup}</h3>
              <p className="text-sm -mt-1 text-gray-600">Pickup Location</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{destination}</h3>
              <p className="text-sm -mt-1 text-gray-600">Drop Location</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
