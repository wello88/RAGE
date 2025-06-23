import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { sendEmail } from "../../utils/email.js";
import { hashPassword } from "../../utils/hashAndcompare.js";
import { htmlTemplate } from "../../utils/htmlTemplate.js";
import { genrateToken } from "../../utils/token.js";

export const signUp = async (req, res, next) => {

    const { firstName, lastName, email, age, phone, weight, password } = req.body;

    //check if user already exists
    const userExist = await User.findOne({ email })
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 400));
    }

    const Hashedpassword = hashPassword({ password });
    //create new user
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        age,
        phone,
        weight,
        password: Hashedpassword
    });


    const token = genrateToken({ payload: { email } });
     await sendEmail({
        to: email,
        subject: 'RAGE Email Verification',
        html: htmlTemplate(token)
    });

    if (!token) {
        return next(new AppError(messages.user.failtoverify, 500));
    }
    const createdUser = await newUser.save();
    if (!createdUser) {
        return next(new AppError(messages.user.failtocreate, 500));
    }
    return res.status(201).json({
        message: messages.user.createSuccessfully,
        data: createdUser,
        success: true
    })


}