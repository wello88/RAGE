import joi from "joi";

export const addCoachValidation = joi.object({
   
        firstName: joi.string().required().trim().lowercase(),
        lastName: joi.string().required().trim().lowercase(),
        email: joi.string().email().required().trim().lowercase(),
        phone: joi.string().required().trim(),
        profilePhoto: joi.string().uri().optional(),
       

    });

   
