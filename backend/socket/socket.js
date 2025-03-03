const { Server } = require("socket.io");

function initializeSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: "https://cryptomarket-n3eh.onrender.com", // Single origin for Socket.IO
      methods: ["GET", "POST"],
      credentials: true, // Optional: Include if you need cookies/auth headers
    },
  });

  // Attach io to the app object
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
