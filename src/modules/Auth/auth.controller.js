import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import { status } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";
import { sendEmail } from "../../utils/email.js";
import { hashPassword, comparePassword } from "../../utils/hashAndcompare.js";
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


export const login = async (req, res, next) => {
    const { email, password } = req.body;
    //check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
        return next(new AppError(messages.user.notfound, 404));
    }
    const isVerified = await User.findOne({ email, status: status.VERIFIED });
    if (!isVerified) {
        return next(new AppError(messages.user.notverified, 403));
    }
    //check if password is correct
    const passwordmatch = comparePassword({
        password,
        hashPassword: userExist.password
    })
    if (!passwordmatch) {
        return next(new AppError(messages.user.invalidCreadintials, 400));
    }
    userExist.isActive = true
    await userExist.save();
    const token = genrateToken({ payload: { email: userExist.email, role: userExist.role, id: userExist._id } });
    return res.status(200).json({
        message: messages.user.loginSuccessfully,
        data: { token },
        success: true
    })




}