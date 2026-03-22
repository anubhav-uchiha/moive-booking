const joi = require("joi");

const registerValidation = joi.object({
  first_name: joi.string().min(2).trim().required(),
  last_name: joi.string().min(2).trim().required(),
  email: joi.string().email().lowercase().trim().required(),
  password: joi
    .string()
    .min(8)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[!@#$%^&*]/)
    .trim()
    .required(),
  role: joi.string().valid("user", "admin").lowercase().trim().optional(),
});

const loginValidation = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().min(8).trim().required(),
});

module.exports = {
  registerValidation,
  loginValidation,
};
