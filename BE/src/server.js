const express = require("express");
const cors = require("cors");
const { connectDB } = require("./configs/database.config");
require("dotenv").config();

const app = express();

// MIDDLEWARES
app.use(cors());

// Parse JSON requests
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  }),
);
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api", require("./routes"));

// ERROR HANDLER MIDDLEWARE
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

// START SERVER
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {});
  } catch (error) {
    process.exit(1);
  }
};

startServer();

module.exports = app;
