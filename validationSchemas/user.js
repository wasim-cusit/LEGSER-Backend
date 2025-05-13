// validation.js
const Joi = require("joi");

// Company validation schema
const companySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone_number: Joi.string().required(),
  status: Joi.string()
    .valid("approve", "decline", "pending")
    .default("pending"),
});

const updateRegisterationStatusSchema = Joi.object({
  registeration_status: Joi.string().valid("approve", "decline", "pending"),
});

const updatePaymentStatusSchema = Joi.object({
  payment_status: Joi.string().valid("approve", "decline", "pending"),
});

const updatePaymentsStatusSchema = Joi.object({
  transaction_ids: Joi.array().items(Joi.string()).required(), // An array of strings
});

// Runner validation schema
const userSchema = Joi.object({
  name: Joi.string().required(),
  user_type: Joi.string().required(),
  email: Joi.string().email().allow(null, "").optional(),
  phone_number: Joi.string().allow(null, "").optional(),
  team_id: Joi.number().allow("").optional(),
  university_id: Joi.number().allow("").optional(),
  designation: Joi.string().allow(null, "").optional(),
  strength: Joi.number().allow("").optional(),
  country: Joi.string().allow(null, "").optional(),
  company_size: Joi.string().allow(null, "").optional(),
  city: Joi.string().allow(null, "").optional(),
  address: Joi.string().allow(null, "").optional(),
});

// Visitor validation schema
const visitorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().allow(null, "").optional(),
  phone_number: Joi.string().allow(null, "").optional(),
});

// team validation schema
const teamSchema = Joi.object({
  name: Joi.string().required(),
});

// program validation schema
const programSchema = Joi.object({
  name: Joi.string().required(),
  university_id: Joi.string().required(),
});

const scanSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  user_type: Joi.string().required(),
});

module.exports = {
  companySchema,
  updateRegisterationStatusSchema,
  updatePaymentStatusSchema,
  updatePaymentsStatusSchema,
  visitorSchema,
  teamSchema,
  userSchema,
  programSchema,
  scanSchema
};
