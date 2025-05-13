const express = require("express");
require("dotenv").config();
const { databaseLoader } = require("./config/db");
const Router = require("./routes");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
const path = require("path");
const { createAdminUser } = require("./controllers/user.controller");
const markUsersOffline = require("./corn/markOffline");

app.use("/api", Router);

app.use(express.static(path.join(__dirname, "")));

const PORT = process.env.PORT || 5000;

const RESPONSE_MESSAGES = require("./config/constant").RESPONSE_MESSAGES;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: RESPONSE_MESSAGES.SERVER_ERROR,
    error: err.message,
  });
});

setInterval(async () => {
  await markUsersOffline();
}, 15 * 1000);

const startServer = async () => {
  try {
    await databaseLoader();
    createAdminUser();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during server initialization:", error.message);
  }
};

startServer();
