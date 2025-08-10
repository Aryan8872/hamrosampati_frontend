// property.schema.js

import Joi from 'joi';
import { FURNISHING_TYPES, LISTING_TYPES, PROPERTY_TYPES, STATUS_TYPES } from '../types/enumTypes';

export const propertySchema = Joi.object({
  propertyName: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      'string.base': 'Property name must be a string',
      'string.empty': 'Property name cannot be empty',
      'string.pattern.base': 'Property name can only contain letters and spaces',
      'any.required': 'Property name is required',
    }),

  address: Joi.string().required().messages({
    'string.base': 'Address must be a string',
    'string.empty': 'Address cannot be empty',
    'any.required': 'Address is required',
  }),

  areaTotal: Joi.number().min(4).required().messages({
    'number.base': 'Total area must be a number',
    'number.min': 'Total area must be greater than 4 digits',
    'any.required': 'Total area is required',
  }),

  bathrooms: Joi.number().min(0).required().messages({
    'number.base': 'Bathrooms must be a number',
    'number.min': 'Number of bathrooms cannot be negative',
    'any.required': 'Number of bathrooms is required',
  }),

  bedrooms: Joi.number().min(0).required().messages({
    'number.base': 'Bedrooms must be a number',
    'number.min': 'Number of bedrooms cannot be negative',
    'any.required': 'Number of bedrooms is required',
  }),

  city: Joi.string().required().messages({
    'string.base': 'City must be a string',
    'string.empty': 'City cannot be empty',
    'any.required': 'City is required',
  }),

  district: Joi.string().required().messages({
    'string.base': 'District must be a string',
    'string.empty': 'District cannot be empty',
    'any.required': 'District is required',
  }),

  floorCount: Joi.number().min(0).required().messages({
    'number.base': 'Floor count must be a number',
    'number.min': 'Floor count cannot be negative',
    'any.required': 'Floor count is required',
  }),

  furnishingStatus: Joi.string().valid(...Object.values(FURNISHING_TYPES)).required().messages({
    'any.only': 'Invalid furnishing status',
    'any.required': 'Furnishing status is required',
  }),

  kitchens: Joi.number().min(0).required().messages({
    'number.base': 'Kitchens must be a number',
    'number.min': 'Number of kitchens cannot be negative',
    'any.required': 'Number of kitchens is required',
  }),

  listingType: Joi.string().valid(...Object.values(LISTING_TYPES)).required().messages({
    'any.only': 'Invalid listing type',
    'any.required': 'Listing type is required',
  }),

  propertyPrice: Joi.string().required().messages({
    'string.base': 'Property price must be a string',
    'string.empty': 'Property price cannot be empty',
    'any.required': 'Property price is required',
  }),

  propertyType: Joi.string().valid(...Object.values(PROPERTY_TYPES)).required().messages({
    'any.only': 'Invalid property type',
    'any.required': 'Property type is required',
  }),

  yearBuilt: Joi.string().required().messages({
    'string.base': 'Year built must be a string',
    'string.empty': 'Year built cannot be empty',
    'any.required': 'Year built is required',
  }),

  status: Joi.string().valid(...Object.values(STATUS_TYPES)).required().messages({
    'any.only': 'Invalid status',
    'any.required': 'Status is required',
  }),

  latitude: Joi.number().required().messages({
    'number.base': 'Latitude must be a number',
    'any.required': 'Latitude is required',
  }),

  longitude: Joi.number().required().messages({
    'number.base': 'Longitude must be a number',
    'any.required': 'Longitude is required',
  }),

  isFeatured: Joi.boolean().messages({
    'boolean.base': 'featured should be a boolean',
  }),

  description: Joi.string().min(10).messages({
    'string.base': 'Description must be a string',
    'string.empty':'Description cannot be empty',
    'string.min':'Description must be greater than 10 words'
  }),

  amneties: Joi.array().items(Joi.string()).messages({
    'array.base': 'Amenities must be an array of strings',
  }),
});


export const updatePropertySchema = Joi.object({
  propertyName: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      'string.base': 'Property name must be a string',
      'string.empty': 'Property name cannot be empty',
      'string.pattern.base': 'Property name can only contain letters and spaces',
      'any.required': 'Property name is required',
    }),

  address: Joi.string().required().messages({
    'string.base': 'Address must be a string',
    'string.empty': 'Address cannot be empty',
    'any.required': 'Address is required',
  }),

  areaTotal: Joi.number().min(4).required().messages({
    'number.base': 'Total area must be a number',
    'number.min': 'Total area cannot be negative',
    'any.required': 'Total area is required',
  }),
  images: Joi.array().items(Joi.string()).max(5).messages({
    'array.base': 'Images must be an array',
    'array.includes': 'Images must contain only strings',
  })
  ,
  bathrooms: Joi.number().min(0).required().messages({
    'number.base': 'Bathrooms must be a number',
    'number.min': 'Number of bathrooms cannot be negative',
    'any.required': 'Number of bathrooms is required',
  }),

  bedrooms: Joi.number().min(0).required().messages({
    'number.base': 'Bedrooms must be a number',
    'number.min': 'Number of bedrooms cannot be negative',
    'any.required': 'Number of bedrooms is required',
  }),

  city: Joi.string().required().messages({
    'string.base': 'City must be a string',
    'string.empty': 'City cannot be empty',
    'any.required': 'City is required',
  }),

  district: Joi.string().required().messages({
    'string.base': 'District must be a string',
    'string.empty': 'District cannot be empty',
    'any.required': 'District is required',
  }),

  floorCount: Joi.number().min(0).required().messages({
    'number.base': 'Floor count must be a number',
    'number.min': 'Floor count cannot be negative',
    'any.required': 'Floor count is required',
  }),

  furnishingStatus: Joi.string().valid(...Object.values(FURNISHING_TYPES)).required().messages({
    'any.only': 'Invalid furnishing status',
    'any.required': 'Furnishing status is required',
  }),

  kitchens: Joi.number().min(0).required().messages({
    'number.base': 'Kitchens must be a number',
    'number.min': 'Number of kitchens cannot be negative',
    'any.required': 'Number of kitchens is required',
  }),

  listingType: Joi.string().valid(...Object.values(LISTING_TYPES)).required().messages({
    'any.only': 'Invalid listing type',
    'any.required': 'Listing type is required',
  }),

  propertyPrice: Joi.string().required().messages({
    'string.base': 'Property price must be a string',
    'string.empty': 'Property price cannot be empty',
    'any.required': 'Property price is required',
  }),

  propertyType: Joi.string().valid(...Object.values(PROPERTY_TYPES)).required().messages({
    'any.only': 'Invalid property type',
    'any.required': 'Property type is required',
  }),

  yearBuilt: Joi.string().required().messages({
    'string.base': 'Year built must be a string',
    'string.empty': 'Year built cannot be empty',
    'any.required': 'Year built is required',
  }),

  status: Joi.string().valid(...Object.values(STATUS_TYPES)).required().messages({
    'any.only': 'Invalid status',
    'any.required': 'Status is required',
  }),

  latitude: Joi.number().required().messages({
    'number.base': 'Latitude must be a number',
    'any.required': 'Latitude is required',
  }),

  longitude: Joi.number().required().messages({
    'number.base': 'Longitude must be a number',
    'any.required': 'Longitude is required',
  }),

  isFeatured: Joi.boolean().messages({
    'boolean.base': 'featured should be a boolean',
  }),

  description: Joi.string().min(10).messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty',
    'string.min':"Description must be greater than 10 words"
  }),

  amneties: Joi.array().items(Joi.string()).messages({
    'array.base': 'Amenities must be an array of strings',
  }),
}).options({stripUnknown:true})

