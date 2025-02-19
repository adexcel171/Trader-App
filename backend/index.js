const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

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

// ✅ Define Frontend Path Correctly
// const frontendPath = path.join(__dirname, "../frontend/dist/index.html");
const frontendPath = path.join(__dirname, "../frontend/dist");

// ✅ Serve React Frontend **Only in Production**
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendPath));

  // ✅ Handle React Routes **without affecting API routes**
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
