const Joi = require("joi");
const { URGENCY_LEVELS, BUDGET_TYPES } = require("../config/constant");

const caseSchema = Joi.object({
  title: Joi.string().min(3).required(),

  description: Joi.string().required(),

  expertise_required: Joi.array().items(Joi.string()).min(1).required(),

  case_category: Joi.string().required(),

  urgency: Joi.string()
    .valid(...Object.values(URGENCY_LEVELS))
    .required(),

  budget_type: Joi.string()
    .valid(...Object.values(BUDGET_TYPES))
    .required(),

  budget_amount: Joi.number().min(0).allow(null, "").messages({
    "number.min": "Budget amount cannot be negative",
  }),

  client_id: Joi.number().required(),

  location: Joi.string().min(3).max(255).required(),
});

module.exports = { caseSchema };
