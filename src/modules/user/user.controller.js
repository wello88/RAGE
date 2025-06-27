import { User } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../../utils/cloudinary.js";
import { status } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";


export const getUserProfile = async (req, res, next) => {

    const user = req.authUser;
    if (!user) {
        return next(new AppError(messages.user.notauthorized, 404));
    }
    if (user.status !== status.VERIFIED) {
        return next(new AppError(messages.user.notverified, 403));
    }
    if (user.status === status.BLOCKED) {
        return next(new AppError(messages.user.blocked, 403));
    }
    return res.status(200).json({
        message: messages.user.getsuccessfully,
        success: true,
        data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            phone: user.phone,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            role: user.role,
            status: user.status,
            profilePhoto: user.profilePhoto
        }
    });

}



export const getUsers = async (req, res, next) => {

    const user = req.authUser;
    if (!user) {
        return next(new AppError(messages.user.notauthorized, 404));
    }
    if (user.status !== status.VERIFIED) {
        return next(new AppError(messages.user.notverified, 403));
    }
    if (user.status === status.BLOCKED) {
        return next(new AppError(messages.user.blocked, 403));
    }
    const users = await User.find();
    return res.status(200).json({
        message: messages.user.getsuccessfully,
        success: true,
        data: users
    });


}


export const getUserById = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError(messages.user.notfound, 404));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError(messages.user.notfound, 404));
    }
    return res.status(200).json({
        message: messages.user.getsuccessfully,
        success: true,
        data: user
    });
}

export const updateUserProfile = async (req, res, next) => {
    const user = req.authUser;

    if (!user) {
        return next(new AppError(messages.user.notauthorized, 404));
    }
    if (user.status !== status.VERIFIED) {
        return next(new AppError(messages.user.notverified, 403));
    }
    if (user.status === status.BLOCKED) {
        return next(new AppError(messages.user.blocked, 403));
    }

    const { firstName, lastName, age, phone, weight } = req.body;

    user.firstName = firstName || user.firstName;

    user.lastName = lastName || user.lastName;
    user.age = age || user.age;
    user.phone = phone || user.phone;
    user.weight = weight || user.weight;
    user.height = req.body.height || user.height;
    user.gender = req.body.gender || user.gender;

    if (req.file) {
        try {
            const folder = `profilePictures(Rage)/${user.firstName}-${user._id}`;
            const publicId = 'profile';
            const uploadedImage = await uploadImageToCloudinary(req.file, folder, publicId);
            user.profilePhoto = uploadedImage.secure_url;
        } catch (error) {
            return next(new AppError('Failed to upload profile photo', 500));
        }
    }

    // Save updated user profile
    try {
        await user.save();
    } catch (error) {
        return next(new AppError('Failed to update user profile', 500));
    }

    return res.status(200).json({
        message: messages.user.updateSuccessfully,
        success: true,
        data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            phone: user.phone,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            role: user.role,
            status: user.status,
            profilePhoto: user.profilePhoto
        }
    });
};


export const deleteUserProfile = async (req, res, next) => {
    const user = req.authUser;
    if (!user) {
        return next(new AppError(messages.user.notauthorized, 404));
    }
    if (user.status !== status.VERIFIED) {
        return next(new AppError(messages.user.notverified, 403));
    }
    if (user.status === status.BLOCKED) {
        return next(new AppError(messages.user.blocked, 403));
    }
    // Delete profile image from Cloudinary
    if (user.profilePhoto) {
        try {
            await deleteImageFromCloudinary(user.profilePhoto);
        } catch (error) {
            return next(new AppError('Failed to delete profile photo', 500));
        }
    }
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
        message: messages.user.deleteSuccessfully,
        success: true
    });

}