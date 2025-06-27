import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../../middlewares/authentication.js";
import { asyncHandler } from "../../utils/appError.js";
import { isValid } from "../../middlewares/validation.js";
import { addCoachValidation } from "./admin.validation.js";
import { addCoach, addOperatingHours, deleteCoach, deleteOperatingHours, getCoaches, getOperatingHours, updateCoach } from "./admin.controller.js";
import { cloudupload } from "../../utils/multer.cloud.js";

const adminRouter = Router();

//ADMIN ADD COACHES

adminRouter.post('/add-coach',isAuthenticated(), isAuthorized(['admin']) ,cloudupload().single('profilePhoto'),asyncHandler(addCoach))
adminRouter.get('/coaches', asyncHandler(getCoaches));
// Validation for adding a coach
adminRouter.put('/update-coach/:id', isAuthenticated(), isAuthorized(['admin']), cloudupload().single('profilePhoto'), asyncHandler(updateCoach));
    
adminRouter.delete('/delete-coach/:id', isAuthenticated(), isAuthorized(['admin']), asyncHandler(deleteCoach));

adminRouter.post('/add-operating-hours', isAuthenticated(), isAuthorized(['admin']), asyncHandler(addOperatingHours));

adminRouter.get('/operating-hours', asyncHandler(getOperatingHours))

adminRouter.delete('/delete-operating-hours/:time', isAuthenticated(), isAuthorized(['admin']), asyncHandler(deleteOperatingHours))
export default adminRouter; 