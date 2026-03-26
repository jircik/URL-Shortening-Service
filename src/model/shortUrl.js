import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    longUrl: {type: String, required:true},
    shortCode: {type: String, required:true, unique:true},
    accessCount: {type: Number, default:0},
    isActive: {type: Boolean, default: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    expiresAt: {type: Date, default: null},
},{ timestamps: true, versionKey: false}
);

shortUrlSchema.index({ createdAt: -1 });
shortUrlSchema.index({ expiresAt: 1 });

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
export default ShortUrl;