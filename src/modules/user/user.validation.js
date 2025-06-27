import joi from 'joi';


export const updateUserSchema = joi.object({
    
    firstName: joi.string().min(2).max(50).optional(),
    lastName: joi.string().min(2).max(50).optional(),
    email: joi.string().email().optional(),
    phone: joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    profilePhoto: joi.string().uri().optional()
}).or('firstName', 'lastName', 'email', 'phone', 'profilePhoto'); // At least one field must be provided