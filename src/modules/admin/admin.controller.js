import { Coach } from "../../../db/models/coach.model.js";
import { Session } from "../../../db/models/sessions.model.js";
import { AppError } from "../../utils/appError.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../../utils/cloudinary.js";
import { messages } from "../../utils/constant/messages.js";

export const addCoach = async (req, res, next) => {

    const { firstName, lastName, email, phone, socialMedia } = req.body;
    let profilePhoto = req.body.profilePhoto;
    const coachExist = await Coach.findOne({ email })

    // Parse socialMedia from string to object if needed
    let socialMediaParsed = {};
    if (req.body.socialMedia) {
        socialMediaParsed =
            typeof req.body.socialMedia === "string"
                ? JSON.parse(req.body.socialMedia)
                : req.body.socialMedia;
    }



    if (coachExist) {
        return next(new AppError(messages.coach.alreadyExist, 400));
    }
    if (req.file) {
        const folder = 'coaches';
        const publicId = `coaches/${req.file.filename}`;
        const uploadImage = await uploadImageToCloudinary(req.file, folder, publicId)
        profilePhoto = uploadImage.secure_url
    }
    const coach = await Coach.create({
        firstName,
        lastName,
        email,
        phone,
        profilePhoto: profilePhoto,
        socialMedia:socialMediaParsed
    });

    if (!coach) {
        return next(new AppError(messages.coach.failtocreate, 400));
    }
    return res.status(201).json({
        status: 'success',
        message: messages.coach.createSuccessfully,
        data: {
            coach
        }
    });
}


export const getCoaches = async (req, res, next) => {
    const coaches = await Coach.find();
    if (!coaches) {
        return next(new AppError(messages.coach.notfound, 404));
    }
    return res.status(200).json({
        status: 'success',
        message: messages.coach.getsuccessfully,
        data: {
            coaches
        }
    });
}


export const updateCoach = async (req, res, next) => {
    const { id } = req.params;

    const { firstName, lastName, email, phone, socialMedia } = req.body;
    let profilePhoto = req.body.profilePhoto;
    // Parse socialMedia from string to object if needed
    let socialMediaParsed = {};
    if (req.body.socialMedia) {
        socialMediaParsed =
            typeof req.body.socialMedia === "string"
                ? JSON.parse(req.body.socialMedia)
                : req.body.socialMedia;
    }
    // Check if the coach exists
    const coachExists = await Coach.findById(id);
    if (!coachExists) {
        return next(new AppError(messages.coach.notfound, 404));
    }
    // If a new profile photo is uploaded, delete the old one from Cloudinary
    if (req.file) {
        if (coachExists.profilePhoto) {
            try {
                await deleteImageFromCloudinary(coachExists.profilePhoto);
            } catch (error) {
                return next(new AppError('Failed to delete old profile photo', 500));
            }
        }
        const folder = 'coaches';
        const publicId = `coaches/${req.file.filename}`;
        const uploadImage = await uploadImageToCloudinary(req.file, folder, publicId)
        profilePhoto = uploadImage.secure_url
    }
    const coach = await Coach.findByIdAndUpdate(id, {
        firstName,
        lastName,
        email,
        phone,
        profilePhoto: profilePhoto || coachExists.profilePhoto,
        socialMedia: socialMediaParsed || coachExists.socialMedia
    }, { new: true });
    if (!coach) {
        return next(new AppError(messages.coach.notfound, 404));
    }
    return res.status(200).json({
        status: 'success',
        message: messages.coach.updateSuccessfully,
        data: {
            coach
        }
    })
}



export const deleteCoach= async (req, res, next) => {
    const { id } = req.params;
    //delete image from cloudinary
    if (!id) {
        return next(new AppError(messages.coach.notfound , 400));
    }
   
    // Check if the coach exists
    const coachExists = await Coach.findById(id);
    if (!coachExists) {
        return next(new AppError(messages.coach.notfound, 404));
    }
    // If the coach exists, delete the image from Cloudinary
    if (coachExists.profilePhoto) {
        try {
            await deleteImageFromCloudinary(coachExists.profilePhoto);
        } catch (error) {
            return next(new AppError('Failed to delete profile photo', 500));
        }
    }


    const coach = await Coach.findByIdAndDelete(id);
    if (!coach) {
        return next(new AppError(messages.coach.notfound, 404));
    }
    return res.status(200).json({
        status: 'success',
        message: messages.coach.deleteSuccessfully,
        data: {
            coach
        }
    });


}



export const addOperatingHours = async(req, res, next) => {

    const {type , time} = req.body;

    const timeExist = await Session.findOne({ type, time });
    if (timeExist) {
        return next(new AppError(messages.session.alreadyExist, 400));
    }

    const operatingHours = await Session.create({
        type,
        time
    });
    if (!operatingHours) {
        return next(new AppError(messages.session.failtocreate, 400));
    }
    return res.status(201).json({
        status: 'success',
        message: messages.session.createSuccessfully,
        data: {
            operatingHours
        }
    });

}


export const getOperatingHours = async(req, res, next) => {
    const operatingHours = await Session.find();
    if (!operatingHours) {
        return next(new AppError(messages.session.notfound, 404));
    }
    return res.status(200).json({
        status: 'success',
        message: messages.session.getsuccessfully,
        data: {
            operatingHours
        }
    });
}


export const deleteOperatingHours = async(req, res, next) => {
    const { time } = req.params;
    if (!time) {
        return next(new AppError(messages.session.notfound, 400));
    }
    const operatingHours = await Session.findOneAndDelete(time);
    if (!operatingHours) {
        return next(new AppError(messages.session.notfound, 404));
    }
    return res.status(200).json({
        status: 'success',
        message: messages.session.deleteSuccessfully,
        data: {
            operatingHours
        }
    });
}