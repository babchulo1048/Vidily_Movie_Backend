const express = require("express");
const { User } = require("../models/User");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const passwordComplexity = require("joi-password-complexity");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  let user = await User.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
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
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexitySchema.required(),
  };

  return Joi.validate(user, schema);
}

module.exports = router;
