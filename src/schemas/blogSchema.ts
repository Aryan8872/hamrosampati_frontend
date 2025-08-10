import Joi from 'joi';

export const blogSchema = Joi.object({
    blogId: Joi.string().optional(),

    title: Joi.string().min(5).max(150).required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'string.min': 'Title should be at least 5 characters long',
        'string.max': 'Title should not exceed 150 characters',
        'any.required': 'Title is required',
    }),

    excerpt: Joi.string().messages({
        'string.base': 'Excerpt must be a string',
        'string.empty': 'Excerpt is required',
    }),
    authorName: Joi.string().messages({
        'string.base': 'AuthorName must be a string',
        'string.empty': 'AuthorName is required',
    })
    ,
    creator: Joi.object().optional(),

    content: Joi.string().min(20).required().messages({
        'string.base': 'Content must be a string',
        'string.empty': 'Content is required',
        'string.min': 'Content should be at least 20 characters long',
        'any.required': 'Content is required',
    }),

    featuredImage: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required()
        .messages({
            'string.uri': 'Featured image must be a valid URL',
            'string.empty': 'Featured image is required',
            'any.required': 'Featured image is required',
        }),

    publishDate: Joi.string().messages({
        'string.base': 'Publish date must be a string or null',
        'string.empty': 'Publish date is required',
        'any.required': 'Publish date is required',

    }),

    tags: Joi.array().items(Joi.string()).messages({
        'array.base': 'Tags must be an array of strings or null',
        'string.empty': 'Tags is required',
        'any.required': 'Tags is required',
    }),

    creatorId: Joi.string().required().messages({
        'string.base': 'Author ID must be a string',
        'string.empty': 'Author ID is required',
        'any.required': 'Author ID is required',
    }),
});


export const updateBlogSchema = Joi.object({
    blogId: Joi.string().optional(),

    title: Joi.string().min(5).max(150).required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'string.min': 'Title should be at least 5 characters long',
        'string.max': 'Title should not exceed 150 characters',
        'any.required': 'Title is required',
    }),

    excerpt: Joi.string().messages({
        'string.base': 'Excerpt must be a string',
        'string.empty': 'Excerpt is required',
    }),
    authorName: Joi.string().messages({
        'string.base': 'AuthorName must be a string',
        'string.empty': 'AuthorName is required',
    })
    ,
    creator: Joi.object().optional(),

    content: Joi.string().min(20).required().messages({
        'string.base': 'Content must be a string',
        'string.empty': 'Content is required',
        'string.min': 'Content should be at least 20 characters long',
        'any.required': 'Content is required',
    }),

    featuredImage: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required()
        .messages({
            'string.uri': 'Featured image must be a valid URL',
            'string.empty': 'Featured image is required',
            'any.required': 'Featured image is required',
        }),

    publishDate: Joi.string().messages({
        'string.base': 'Publish date must be a string or null',
        'string.empty': 'Publish date is required',
        'any.required': 'Publish date is required',

    }),

    tags: Joi.array().items(Joi.string()).messages({
        'array.base': 'Tags must be an array of strings or null',
        'string.empty': 'Tags is required',
        'any.required': 'Tags is required',
    }),

    creatorId: Joi.string().required().messages({
        'string.base': 'Author ID must be a string',
        'string.empty': 'Author ID is required',
        'any.required': 'Author ID is required',
    }),
}).options({ stripUnknown: true })







