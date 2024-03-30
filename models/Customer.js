const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean().required(),
  };

  return Joi.validate(customer, schema);
}

const CustomerModel = mongoose.model("customers", customerSchema);

exports.Customer = CustomerModel;
exports.validate = validateCustomer;
