const express = require("express");
const cors = require("cors");
const { connectDB } = require("./configs/database.config");
const corsOptions = require("./configs/cors.config");
const setupMiddleware = require("./configs/middleware.config");
const errorHandler = require("./middlewares/errorHandler.middleware");
require("dotenv").config();

const app = express();

app.use(cors(corsOptions));
setupMiddleware(app);
app.use("/api", require("./routes"));
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server connection failed:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
