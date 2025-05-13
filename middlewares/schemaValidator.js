const Joi = require("joi");
const responseHelper = require("../helpers/response.helper");

const schemaValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message.replace(/"/g, ""));
      return responseHelper.fail(res, errorMessages, 400);
    }
    
    next();
  };
};

module.exports = schemaValidator;
