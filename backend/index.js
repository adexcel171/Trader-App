const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const path = require("path");
const http = require("http"); // Import http module
const initializeSocket = require("./socket/socket");
const userRoutes = require("./routes/userRoutes.js");

const app = express();

// ✅ Apply CORS Middleware First
app.use(
  cors({
    origin: ["https://cryptomarket-n3eh.onrender.com", "http://localhost:5173"], // Allow both origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable cookies
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

// ✅ Create HTTP Server
const server = http.createServer(app);

<<<<<<< HEAD
// ✅ Initialize Socket.io and pass the app object
initializeSocket(server, app);
=======
// ✅ Initialize Socket.io
const io = initializeSocket(server);
>>>>>>> 47cb585e211e80c3793740534b4a2593c4f69269

// ✅ Ensure Axios is Imported
app.get("/api/top-cryptos", async (req, res) => {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "2d337d70-4775-4eda-8aa2-d572150e00b1",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// API routes
app.use("/api/cryptos", require("./routes/cryptoRoutes"));
app.use("/api/users", userRoutes);

// ✅ Serve React Frontend in Production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // ✅ Handle React Routes Properly
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api") && req.accepts("html")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
