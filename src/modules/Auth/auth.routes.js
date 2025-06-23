import {Router} from 'express';
import { asyncHandler } from '../../utils/appError.js';
import { login, signUp } from './auth.controller.js';
import { isValid } from '../../middlewares/validation.js';
import { loginSchema, signupSchema } from './auth.validation.js';


const authRouter = Router();

//signup route
authRouter.post('/signup', isValid(signupSchema) ,asyncHandler(signUp))
//login route
authRouter.post('/login',  isValid(loginSchema), asyncHandler(login)); 

export default authRouter;