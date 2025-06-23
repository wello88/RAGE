import {Router} from 'express';
import { asyncHandler } from '../../utils/appError.js';
import { signUp } from './auth.controller.js';


const authRouter = Router();

//signup route
authRouter.post('/signup', 
    // asyncHandler(
    signUp
// )
)

export default authRouter;