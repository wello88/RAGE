import {Router} from 'express';
import { asyncHandler } from '../../utils/appError.js';
import { forgetPassword, login, resetPassword, signUp, verifyOtp } from './auth.controller.js';
import { isValid } from '../../middlewares/validation.js';
import { forgetPasswordSchema, loginSchema, otpSchema, resetPasswordSchema, signupSchema } from './auth.validation.js';


const authRouter = Router();

//signup route
authRouter.post('/signup', isValid(signupSchema) ,asyncHandler(signUp))
//login route
authRouter.post('/login',  isValid(loginSchema), asyncHandler(login)); 

authRouter.post('/forget-password', isValid(forgetPasswordSchema), asyncHandler(forgetPassword));
authRouter.post('/verify-otp', isValid(otpSchema), asyncHandler(verifyOtp));
authRouter.post('/reset-password', isValid(resetPasswordSchema), asyncHandler(resetPassword));


export default authRouter;