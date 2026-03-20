require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
