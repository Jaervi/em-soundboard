const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
require("express-async-errors");

const middleware = require("./utils/middleware");
const entryRouter = require("./controllers/entries");
const fileRouter = require("./controllers/files");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

app.use(middleware.tokenExtractor);
app.use(cors());
app.use(express.json());

app.use("/api/users", middleware.userExtractor, usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/entries", entryRouter);
app.use("/api/files", fileRouter);

module.exports = app;
