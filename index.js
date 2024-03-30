require("express-async-errors");
const winston = require("winston");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const error = require("./middleware/error");
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("config");

const Fawn = require("fawn");
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/vidly2")
  .then(() => console.log("mongodb connected"))
  .catch((ex) => console.error(ex));
Fawn.init(mongoose);

winston.add(winston.transports.File, { filename: "logfile.log" });

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtprivatekey not defined");
  process.exit(1);
}

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server listening to port ${port}`);
});
