// src/schemas/tourRequestSchema.ts
import Joi from 'joi';

export const tourRequestSchema = Joi.object({
    fullName: Joi.string().required(),
    userId: Joi.string(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    phone: Joi.string().required(),
    propertyId: Joi.string().required(),
    preferredDate: Joi.date().iso().required(),
    preferredTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            'string.pattern.base': 'Time must be in HH:MM format (24-hour clock)',
        }),
});


export const tourRequestPersonalInfoSchema = Joi.object({
    fullName: Joi.string().required().messages({
        'string.empty': 'Full name is required',
    }),
    email: Joi.string().email({ tlds: false }).required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address',
    }),
    phone: Joi.string()
        .pattern(/^\+?[0-9]{7,15}$/)
        .required()
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Please enter a valid phone number',
        }),
});