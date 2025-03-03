import { io } from "socket.io-client";

const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://trader-xewp.onrender.com" // Replace with your Render backend URL
    : "http://localhost:5000"
);

export default socket;