import { model, Schema } from "mongoose";
import { sessionType } from "../../src/utils/constant/enums.js";


 const sessionSchema = new Schema({
    type:{
        type: String,
        required: true,
        enum: Object.values(sessionType)
    },
    time: {
        type: String,
        required: true,
        enum:["07:00 AM","08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"]
    },
 })

 export const Session = model('Session', sessionSchema)