const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 50,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const userModel = mongoose.model("users", userSchema);

function validateUser(user) {
  const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  };
  const passwordComplexitySchema = new passwordComplexity(complexityOptions);

  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexitySchema.required(),
  };

  return Joi.validate(user, schema);
}

exports.User = userModel;
exports.validate = validateUser;
