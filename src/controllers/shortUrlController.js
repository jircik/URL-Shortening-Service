import ShortUrl from "../model/shortUrl.js";
import { customAlphabet } from 'nanoid';
import mongoose from "mongoose";

const alphabet = '0123456789abcdef'
const generateShortCode = customAlphabet(alphabet, 10);

const baseUrl = process.env.BASE_URL || "http://localhost:3000"


class ShortUrlController {

    static async createShortUrl(req, res, next) {
        const { longUrl, shortCode, duration } = req.body;

        if (!longUrl) {
            return res.status(400).json({message: 'longUrl is required'});
        }

        try {
            new URL(longUrl);
        } catch (e) {
            return res.status(400).json({message: 'The LongUrl is not a valid URL'});
        }

        try {

            let finalShortCode;

            if (shortCode) {
                finalShortCode = shortCode.trim();
            } else {
                finalShortCode = generateShortCode();
            }

            let createdBy = null;
            let expiresAt;

            if (req.user) {
                createdBy = req.user.userId;
                expiresAt = duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null;
            } else {
                expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            }

            const newShortUrl = await ShortUrl.create({
                longUrl,
                shortCode: finalShortCode,
                createdBy,
                expiresAt,
            });

            return res.status(200).json({
                message: 'shortUrl created successfully',
                shortUrl: newShortUrl,
                newUrl: `${baseUrl}/${newShortUrl.shortCode}`,
                expiresAt: newShortUrl.expiresAt,
            });

        } catch (err){
            //MongoDb duplicate key Error
            if (err.code === 11000) {
                return res.status(409).json({message:"Short Url already exists"});
            }
            return next(err);
        }
    }

    static async redirectFromShortUrl(req, res, next) {
        const { shortCode } = req.params;

        try{

            const shortUrlDoc = await ShortUrl.findOneAndUpdate(
                { shortCode: shortCode },
                { $inc: {accessCount: 1}},
                {
                    new: true,
                    projection: { longUrl: 1, isActive: 1, expiresAt: 1 }
                }
            );

            if (!shortUrlDoc) {
                return res.status(404).json({message:"Url not found"});
            }

            if (shortUrlDoc.isActive === false){
                return res.status(410).json({message:"Url is not active"}); //future: fallback page for expired links
            }

            if(shortUrlDoc.expiresAt && shortUrlDoc.expiresAt < new Date()){
                return res.status(410).json({message:"This shortUrl expired"});
            }

            return res.redirect(301, shortUrlDoc.longUrl);

        } catch (err){
            return next(err);
        }
    }

    static async getDetails(req, res, next) {
        const { shortCode } = req.params;

        try {
            const shortUrlDetails = await ShortUrl.findOne({shortCode: shortCode});

            if (!shortUrlDetails) {
                return res.status(404).json({message: "Url not found"});
            }

            return res.status(200).json({
                shortUrlDetails,
            })
        }catch(err){
            return next(err);
        }
    }

    static async updateState(req, res, next) {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid ID format"});
        }

        const { isActive } = req.body;

        if (isActive === undefined) {
            return res.status(400).json({message: "The 'isActive' field is required in the body"});
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({message:"IsActive field must be a boolean"});
        }

        try{
            const doc = await ShortUrl.findById(id);

            if(!doc){
                return res.status(404).json({message:"Url not found"});
            }

            if (doc.createdBy?.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'You do not own this URL' });
            }

            if(doc.isActive === isActive){
                return res.status(200).json({message:"Url State is already as desired"});
            }

            const updatedDoc = await ShortUrl.findByIdAndUpdate(
                id,
                {isActive: isActive},
                {new: true}
            );
            return res.status(200).json({
                message:"Url State updated",
                shortUrl: updatedDoc
            });

        } catch (err){
            return next(err);
        }

    }

    static async updateShortUrl(req, res, next) {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid ID format"});
        }

        const { shortCode, longUrl } = req.body;

        if (shortCode === undefined && longUrl === undefined) {
            return res.status(400).json({message: "ShortCode or longUrl is required"});
        }

        const updateData = {};

        if (longUrl !== undefined){
            try {
                if (typeof longUrl !== 'string' || longUrl.trim() === '') {
                    return res.status(400).json({ message: "The LongUrl is not a valid URL" });
                }
                new URL(longUrl);
            } catch (e) {
                return res.status(400).json({message: 'The LongUrl is not a valid URL'});
            }
            updateData.longUrl = longUrl;
        }

        if (shortCode !== undefined){
            if (typeof shortCode !== 'string' || shortCode.trim() === '') {
                return res.status(400).json({ message: "ShortCode must be a non-empty string" });
            }
            updateData.shortCode = shortCode.trim();
        }

        try{

            const doc = await ShortUrl.findById(id);

            if(!doc){
                return res.status(404).json({message:"Url not found"});
            }

            if(doc.createdBy?.toString() !== req.user.userId){
                return res.status(403).json({message:"You do not own this Url"});
            }

            const updatedUrl = await ShortUrl.findByIdAndUpdate(
                id,
                updateData,
                {new: true, runValidators: true}
            )

            if(updatedUrl === null){
                return res.status(404).json({message:"Url not found"});
            }

            return res.status(200).json({message:"shortUrl updated"});
        } catch (err){
            if (err.code === 11000) {
                return res.status(409).json({ message: "This shortCode is already in use" });
            }

            return next(err);
        }
    }

    static async listUrls(req, res, next) {

        try{
            let { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

            page = Math.max(1, parseInt(page));
            limit = Math.min(100, Math.max(1, parseInt(limit)));

            const allowedSort = ['createdAt', 'accessCount'];
            if (!allowedSort.includes(sort)) sort = 'createdAt';

            const sortOrder = order === 'asc' ? 1 : -1;

            const filter = { createdBy: req.user.userId };

            const total = await ShortUrl.countDocuments(filter);

            const data = await ShortUrl.find(filter)
                .sort({ [sort]: sortOrder })
                .skip ((page - 1) * limit )
                .limit(limit);

            return res.status(200).json({
                data,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total/limit)
                }
            });
        }
        catch(err){
            return next(err);
        }

    }

}

export default ShortUrlController;