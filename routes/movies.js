const express = require("express");
const { Movie, validate } = require("../models/Movie");
const { Genre } = require("../models/Genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const movies = await Movie.findById(id);

  if (!movies)
    return res.status(400).send("The movies with the given ID not found");

  res.send(movies);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, numberInStock, dailyRentalRate, genreId } = req.body;

  const genre = await Genre.findById(genreId);

  if (!genre)
    return res.status(400).send("The genre with the given ID not found");

  const movies = new Movie({
    title,
    numberInStock,
    dailyRentalRate,
    genre: { _id: genre._id, name: genre.name },
  });

  await movies.save();

  res.send(movies);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, numberInStock, dailyRentalRate, genreId } = req.body;
  const { id } = req.params;
  const genre = await Genre.findById(genreId);
  const movies = await Movie.findByIdAndUpdate(
    id,
    {
      title,
      numberInStock,
      dailyRentalRate,
      genre: { _id: genre._id, name: genre.name },
    },
    { new: true }
  );

  if (!movies)
    return res.status(400).send("The movies with the given ID not found");

  if (!genre)
    return res.status(400).send("The genre with the given ID not found");

  res.send(movies);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const { id } = req.params;
  let movies = await Movie.findByIdAndRemove(id);
  if (!movies)
    return res.status(400).send("The movies with the given ID not found");

  movies = await Movie.find();
  res.send(movies);
});

module.exports = router;
