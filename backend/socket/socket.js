const { Server } = require("socket.io");

let io; // Store the io instance globally within the module

const initializeSocket = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: [
          "https://cryptomarket-n3eh.onrender.com",
          process.env.NODE_ENV === "development" && "http://localhost:5173",
        ].filter(Boolean), // Match your CORS setup in index.js
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    console.log("Socket.IO initialized"); // For debugging
    return io; // Return io for immediate use if needed
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.IO not initialized!");
    }
    return io;
  },
};

module.exports = initializeSocket;
