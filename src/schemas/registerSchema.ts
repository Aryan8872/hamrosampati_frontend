import Joi from "joi";

export const signUpJoiSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
    }),
  fullName: Joi.string().min(5).max(30).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name should have at least 5 characters",
    "string.max": "Full name should have at most 30 characters"
  }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base": "8+ chars, upper, lower, number, special char required",
    }),
  phoneNumber: Joi.string()
    .pattern(new RegExp("^[0-9]{10}$"))
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Please enter a valid phone number (10 digits)",
    }),
  role: Joi.string().valid("USER", "ADMIN"),
});