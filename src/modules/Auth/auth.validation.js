import joi from 'joi';

export const signupSchema = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    age: joi.number().integer().min(0).required(),
    phone: joi.string().pattern(/^[0-9]{10}$/).required(),
    weight: joi.number().min(29).required(),
    password: joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/]).+$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'string.min': 'Password must be at least 8 characters long.',
            'string.empty': 'Password is required.'
        })
});


export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});


export const forgetPasswordSchema = joi.object({
    email: joi.string().email().required()
});

export const otpSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required()
});

export const resetPasswordSchema = joi.object({
    email: joi.string().email().required(),
    newPassword: joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/]).+$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'string.min': 'Password must be at least 8 characters long.',
            'string.empty': 'Password is required.'
        })
});