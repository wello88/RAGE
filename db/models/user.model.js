import { Schema,model } from "mongoose";
import { roles, status } from "../../src/utils/constant/enums.js";



const userSchema= new Schema({

    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    age:{
        type:Number,
        required:true,
        min:0
    },

    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    weight:{
        type:Number,
        required:true,
        min:29
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8
    },
    role:{
        type:String,
        enum:Object.values(roles),
        default: roles.CUSTOMER,
    },
    status:{
        type:String,
        enum:Object.values(status),
        default:status.PENDING
        },

})


export const User = model("User",userSchema);