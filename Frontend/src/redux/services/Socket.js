// socket.js
import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BASE_URL);

    socket.on("connect", () => {
      console.log("✅ Connected to the Server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from the Server");
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized! Call initializeSocket() first.");
  }
  return socket;
};
