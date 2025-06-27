import { Schema, model } from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('./config/.env') });


const coachSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profilePhoto: {
        type: String,
        required: false,
        default:process.env.SECURE_URL,
        trim: true
    },
    socialMedia: {
        type: {
            instagram: { type: String, required: false, trim: true },
            facebook: { type: String, required: false, trim: true }
        }
    }

})

export const Coach = model('Coach', coachSchema)