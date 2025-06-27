import { Schema, model } from "mongoose";
import { gender, roles, status } from "../../src/utils/constant/enums.js";
import dotenv from 'dotenv'
import path from 'path';
dotenv.config({path:path.resolve('./config/.env')})



const userSchema = new Schema({

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
    age: {
      type: Number,
      required: true,
      min: 0
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    weight: {
      type: Number,
      required: true,
      min: 29
    },
    height: {
      type: Number,
      required: true,
      min: 50
    },
    gender: {
      type: String,
      required: true,
      enum:Object.values(gender)
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      Select: false // Do not return password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.CUSTOMER,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.PENDING
    },
    isActive: {
      type: Boolean,
      default: false
    },
    profilePhoto:{
      type: String,
      default: process.env.SECURE_URL
    },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    lastOtpRequest: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },

}, {
  timestamps: true,
  versionKey: false
})
// ✅ Hide password from JSON & Object responses
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

export const User = model("User", userSchema);