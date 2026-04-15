const cookieParser = require("cookie-parser");
const express = require("express");

const setupMiddleware = (app) => {
  app.use(
    express.json({
      type: ["application/json", "text/plain"],
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};

module.exports = setupMiddleware;
