const express = require("express");
const { Customer, validate } = require("../models/Customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", async (req, res) => {
  const genre = await Customer.find();
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);

  if (!customer)
    return res.status(400).send("The customer with the given ID not found");

  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, isGold, phone } = req.body;

  let customer = new Customer({
    name,
    isGold,
    phone,
  });

  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, isGold, phone } = req.body;

  const { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(
    id,
    { name, isGold, phone },
    { new: true }
  );
  if (!customer)
    return res.status(400).send("The customer with the given ID not found");

  res.send(customer);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const { id } = req.params;
  let customer = await Customer.findByIdAndRemove(id);

  if (!customer)
    return res.status(400).send("The customer with the given ID not found");

  // customer = await CustomerModel.find();
  res.send(customer);
});

module.exports = router;
