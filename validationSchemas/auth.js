const Joi = require("joi");
const { ROLES } = require("../config/constant");


const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().min(5).required(),
  address: Joi.string().required(),
  role: Joi.string().valid(...Object.values(ROLES)).required(),
  specialization: Joi.array().items(Joi.string()).allow("").optional(),
  experience: Joi.number().integer().min(0).allow("").optional(),
  profile_picture: Joi.any().optional(),
  certificate: Joi.any().optional(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().allow("").optional(),
});

module.exports = {
  loginSchema,
  registerSchema,
};
