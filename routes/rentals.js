const asyncMiddleware = require("../middleware/async");
const express = require("express");
const { Rental, validate } = require("../models/Rental");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");
const Fawn = require("fawn");

const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { customerId, movieId } = req.body;

  const customer = await Customer.findById(customerId);
  // console.log(customer);
  const movie = await Movie.findById(movieId);

  if (!customerId)
    return res.status(400).send("The customer with the given ID not found");
  if (!movieId)
    return res.status(400).send("The movie with the given ID not found");

  let rentals = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rentals)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rentals);
  } catch (ex) {
    res.status(500).send("Something failed");
  }
});

module.exports = router;
