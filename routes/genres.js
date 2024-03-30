const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const { Genre, validate } = require("../models/Genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  // throw new Error("Could not get the genres.");
  const genre = await Genre.find();
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findById(id);

  if (!genre)
    return res.status(400).send("The genre with the given ID not found");

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name } = req.body;

  const { id } = req.params;
  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: name },
    { new: true }
  );
  if (!genre)
    return res.status(400).send("The genre with the given ID not found");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const { id } = req.params;
  let genre = await Genre.findByIdAndRemove(id);

  if (!genre)
    return res.status(400).send("The genre with the given ID not found");

  // genre = await Genre.find();
  res.send(genre);
});

module.exports = router;
