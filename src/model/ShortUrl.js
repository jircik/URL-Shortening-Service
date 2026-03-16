import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    longUrl: {type: String, required:true},
    shortCode: {type: String, required:true, unique:true},
    accessCount: {type: Number, default:0},
    isActive: {type: Boolean, default: true},
},{ timestamps: true, versionKey: false}
);

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
export default ShortUrl;