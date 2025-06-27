import { Router } from "express";
import { asyncHandler } from "../../utils/appError.js";
import { deleteUserProfile, getUserById, getUserProfile, getUsers, updateUserProfile } from "./user.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/validation.js";
import { cloudupload } from "../../utils/multer.cloud.js";

const userRouter = Router();


userRouter.get('/my-profile',isAuthenticated() ,asyncHandler(getUserProfile));
userRouter.get('/users', isAuthenticated(), isAdmin, asyncHandler(getUsers)); 
userRouter.get('/users/:id', isAuthenticated(),  asyncHandler(getUserById));
userRouter.put('/update-profile', isAuthenticated(),cloudupload().single('profilePhoto'), asyncHandler(updateUserProfile)); 
userRouter.delete('/delete-profile', isAuthenticated(), asyncHandler(deleteUserProfile));
export default userRouter;
