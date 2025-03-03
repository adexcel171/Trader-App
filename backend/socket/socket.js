<<<<<<< HEAD
const { Server } = require("socket.io"); // Correct import statement

function initializeSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
=======
// backend/socket/socket.js
const { Server } = require("socket.io");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "https://cryptomarket-n3eh.onrender.com",
>>>>>>> 47cb585e211e80c3793740534b4a2593c4f69269
      methods: ["GET", "POST"],
    },
  });

<<<<<<< HEAD
  // Attach io to the app object
  app.set("io", io);

=======
>>>>>>> 47cb585e211e80c3793740534b4a2593c4f69269
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
