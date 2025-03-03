const { Server } = require("socket.io"); // Correct import statement

function initializeSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
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
