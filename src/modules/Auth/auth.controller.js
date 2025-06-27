import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import { status } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";
import { sendEmail } from "../../utils/email.js";
import { hashPassword, comparePassword } from "../../utils/hashAndcompare.js";
import { htmlTemplate, htmlTemplateOTP } from "../../utils/htmlTemplate.js";
import { generateOTP } from "../../utils/otp.js";
import { genrateToken } from "../../utils/token.js";

export const signUp = async (req, res, next) => {

    const { firstName, lastName, email, age, phone, weight,height,gender, password } = req.body;

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
        height,
        gender,
        password: Hashedpassword,
        
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


export const forgetPassword = async (req, res, next) => {

    const { email } = req.body;
    //check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
        return next(new AppError(messages.user.notfound, 404));
    }

    const currentTime = Date.now();

    if (userExist.lastOtpRequest) {
        const lastRequestTime = new Date(userExist.lastOtpRequest).getTime();
        const timeSinceLastRequest = currentTime - lastRequestTime;

        if (timeSinceLastRequest < 30 * 1000) {
            const remainingTime = Math.ceil((30 * 1000 - timeSinceLastRequest) / 1000);
            return next(new AppError(`Please wait ${remainingTime} seconds before requesting a new OTP`, 429));
        }
    }
    const otp = generateOTP();

    try {
        userExist.otp = otp;
        userExist.otpExpiry = new Date(currentTime + 15 * 60 * 1000);
        userExist.otpAttempts = 0;
        userExist.lastOtpRequest = new Date(currentTime);
        await userExist.save();

        await sendEmail({
            to: email,
            subject: 'Forget Password',
            html: htmlTemplateOTP(otp),
        });

        return res.status(200).json({
            message: 'Check your email',
            success: true
        });

    } catch (error) {
        userExist.otp = null;
        userExist.otpExpiry = null;
        userExist.otpAttempts = 0;
        userExist.lastOtpRequest = null;
        await userExist.save();
        return next(new AppError('Failed to send email', 500));
    }
};


export const verifyOtp = async (req, res, next) => {
    const { otp, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError(messages.user.notfound, 404));
    }

    const currentTime = Date.now();
    const otpExpiryTime = user.otpExpiry ? new Date(user.otpExpiry).getTime() : 0;

    if (user.otp && otpExpiryTime > currentTime) {
        if (user.otp.toString() !== otp.toString()) {
            user.otpAttempts++;
            await user.save();

            if (user.otpAttempts >= 3) {
                user.otp = null;
                user.otpExpiry = null;
                user.otpAttempts = 0;
                await user.save();
                return next(new AppError('Maximum OTP attempts exceeded. Please request a new OTP.', 403));
            }

            return next(new AppError(`Invalid OTP. You have ${3 - user.otpAttempts} attempts left`, 401));
        }

        user.otpAttempts = 0;
        user.otp = null;
        user.otpExpiry = null;
        user.otpVerified = true;
        await user.save();

        return res.status(200).json({ 
            message: 'OTP verified successfully', 
            success: true 
        });
    }

    const otpCreationTime = otpExpiryTime - (15 * 60 * 1000);
    const timeSinceLastOTP = currentTime - otpCreationTime;

    if (timeSinceLastOTP < 30 * 1000) {
        const remainingTime = Math.ceil((30 * 1000 - timeSinceLastOTP) / 1000);
        return next(new AppError(`Please wait ${remainingTime} seconds before requesting a new OTP`, 429));
    }

    const newOtp = generateOTP();
    try {
        user.otp = newOtp;
        user.otpExpiry = new Date(currentTime + 15 * 60 * 1000);
        user.otpAttempts = 0;
        await user.save();

        await sendEmail({
            to: email,
            subject: 'New OTP',
            html: htmlTemplateOTP(newOtp)
        });

        return res.status(200).json({ 
            message: "Previous OTP expired or invalid. A new OTP has been sent to your email", 
            success: true 
        });
    } catch (error) {
        user.otp = null;
        user.otpExpiry = null;
        user.otpAttempts = 0;
        await user.save();
        return next(new AppError('Failed to send new OTP', 500));
    }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
    const { newPassword, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError(messages.user.notfound, 404));
    }

    if (!user.otpVerified) {
        return next(new AppError('OTP verification required before resetting password.', 403));
    }

    const hashedPassword = hashPassword({ password: newPassword });

    user.password = hashedPassword;
    user.otpVerified = false;
    user.lastOtpRequest = null;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully', success: true });
};
