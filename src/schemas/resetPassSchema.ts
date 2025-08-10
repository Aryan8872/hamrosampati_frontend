import Joi from "joi";


export const resetPassScheam = Joi.object({
    newPassword: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"))
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.pattern.base": "8+ chars, upper, lower, number, special char required",
        }),
    confirmPassword: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"))
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.pattern.base": "8+ chars, upper, lower, number, special char required",
        }),
}).options({ stripUnknown: true })