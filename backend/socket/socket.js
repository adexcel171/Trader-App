const { Server } = require("socket.io");

function initializeSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://cryptomarket-n3eh.onrender.com",
        process.env.NODE_ENV === "development" && "http://localhost:5173",
      ].filter(Boolean),
      methods: ["GET", "POST"],
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
