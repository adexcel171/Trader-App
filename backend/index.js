const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const path = require("path");
const http = require("http");
const initializeSocket = require("./socket/socket");
const userRoutes = require("./routes/userRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// ✅ Apply CORS Middleware First
const allowedOrigins = [
  "https://cryptomarket-n3eh.onrender.com",
  process.env.NODE_ENV === "development" && "http://localhost:5173",
].filter(Boolean); // Remove false values (e.g., if NODE_ENV !== "development")

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Initialize Socket.io and pass the app object
initializeSocket(server, app);

// ✅ Ensure Axios is Imported
app.get("/api/top-cryptos", async (req, res) => {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5",
      {
        headers: {
          "X-CMC_PRO_API_KEY":
            process.env.CMC_API_KEY || "2d337d70-4775-4eda-8aa2-d572150e00b1",
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
app.use("/api/transactions", transactionRoutes);

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Something broke!", error: err.message });
});

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
