const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).max(30).required(),
  };

  return Joi.validate(genre, schema);
}

const GenreModel = mongoose.model("Genre", genreSchema);

exports.Genre = GenreModel;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
