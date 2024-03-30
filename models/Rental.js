const { type } = require("joi/lib/types/object");
const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
      },
      isGold: {
        type: Boolean,
      },
      phone: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
    // required: true,
  },
  rentalFee: {
    type: Number,
    // required: true,
    min: 0,
  },
});

const RentalModel = mongoose.model("rentals", rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(rental, schema);
}

exports.Rental = RentalModel;
exports.validate = validateRental;
