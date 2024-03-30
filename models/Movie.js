const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./Genre");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Genre",
  // }, or
  // type: mongoose.Schema({
  //   name: {
  //     type: String,
  //     minlength: 3,
  //     maxlength: 50,
  //     required: true,
  //   },
  // }),
});

const MovieModel = mongoose.model("movies", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };

  return Joi.validate(movie, schema, { allowUnknown: true });
}

exports.Movie = MovieModel;
exports.validate = validateMovie;
