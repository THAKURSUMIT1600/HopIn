const socketIo = require("socket.io");
const User = require("./models/user.model");
const Captain = require("./models/captain.model");
const RideService = require("./services/ride.service");
let io;

module.exports.sendMessageToSocket = (socketId, eventName, data) => {
  io.to(socketId).emit(eventName, data);
};

module.exports.initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", async (data) => {
      const { userId, userType } = data;

      try {
        if (userType === "user") {
          await User.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true }
          );
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true }
          );
        }
      } catch (error) {
        console.error("Error joining socket:", error);
      }
    });

    socket.on("get-captain-location", async (data) => {
      const { captainId, location } = data;
      try {
        const captain = await Captain.findById(captainId);
        if (captain) {
          captain.location = location;
          await captain.save();
        }
      } catch (error) {
        console.error("Error updating captain location:", error);
      }
    });

    socket.on("ride-cancelled", async (data) => {
      const { rideId, userId, targetSocketId, message } = data;
      if (!rideId || !userId || !targetSocketId || !message) {
        return;
      }
      const ride = await RideService.cancelRide(rideId, userId);

      if (targetSocketId) {
        io.to(targetSocketId).emit("ride-canceled", {
          rideId,
          message,
        });
      }
    });

    // Message handling
    socket.on("message-send", async (data) => {
      const { receiver, message } = data;

      // Validate input data
      if (!receiver || !message) {
        socket.emit("message-error", {
          error: "Missing receiver or message data",
        });
        return;
      }

      try {
        // Check if receiver socket exists and is connected
        const receiverSocket = io.sockets.sockets.get(receiver);
        if (!receiverSocket || !receiverSocket.connected) {
          // Send error back to sender
          socket.emit("message-error", {
            error: "Recipient is not connected",
            targetSocketId: receiver,
          });
          return;
        }

        // Send message to receiver
        receiverSocket.emit("receive-message", {
          message: message,
          sender: socket.id,
          timestamp: new Date().toISOString(),
        });

        // Send confirmation back to sender
        socket.emit("message-sent", {
          message: "Message delivered successfully",
          receiver: receiver,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        socket.emit("message-error", {
          error: "Failed to send message",
          details: error.message,
        });
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", async (reason) => {
      try {
        // Update user/captain socketId to null when they disconnect
        await User.updateOne(
          { socketId: socket.id },
          { $unset: { socketId: 1 } }
        );

        await Captain.updateOne(
          { socketId: socket.id },
          { $unset: { socketId: 1 } }
        );
      } catch (error) {
        console.error("Error cleaning up socket on disconnect:", error);
      }
    });
  });
};
