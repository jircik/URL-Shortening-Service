import ShortUrl from "../model/shortUrl.js";
import { customAlphabet } from 'nanoid';
import mongoose from "mongoose";

const alphabet = '0123456789abcdef'
const generateShortCode = customAlphabet(alphabet, 10);

const baseUrl = process.env.BASE_URL || "http://localhost:3000"


class ShortUrlController {

    static async createShortUrl(req, res) {
        const {longUrl, shortCode} = req.body;

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

            const newShortUrl = await ShortUrl.create({
                longUrl,
                shortCode: finalShortCode
            });

            return res.status(200).json({
                message: 'shortUrl created successfully',
                shortUrl: newShortUrl,
                newUrl: `${baseUrl}/${newShortUrl.shortCode}`
            });

        } catch (err){
            //MongoDb duplicate key Error
            if (err.code === 11000) {
                return res.status(409).json({message:"Short Url already exists"});
            }
            console.error(err);
            return res.status(500).json({
                message:'Server Error',
                error: err.message //use only in dev
            });
        }
    }

    static async redirectFromShortUrl(req, res) {
        const { shortCode } = req.params;

        try{

            const shortUrlDoc = await ShortUrl.findOneAndUpdate(
                { shortCode: shortCode },
                { $inc: {accessCount: 1}},
                {
                    new: true,
                    projection: { longUrl: 1, isActive: 1 }
                }
            );

            if (!shortUrlDoc) {
                return res.status(404).json({message:"Url not found"});
            }

            if (shortUrlDoc.active === false){
                return res.status(410).json({message:"Url is not active"}); //future: fallback page for expired links
            }

            return res.redirect(301, shortUrlDoc.longUrl);

        } catch (err){
            console.error("Erro no redirect:", err);

            //return res.status(500).json({ message: "Internal Server error" }); only in prod
        }
    }

    static async getDetails(req, res) {
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
            console.error("Error getting details:", err);
            //return res.status(500).json({ message: "Internal Server error" }); only in prod
        }
    }

    static async toggleState(req, res) {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid ID format"});
        }

        const { isActive } = req.body;

        if (isActive === undefined) {
            return res.status(400).json({message: "O campo 'isActive' é obrigatório no body"});
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({message:"IsActive field must be a boolean"});
        }

        try{
            const doc = await ShortUrl.findById(id);

            if(!doc){
                return res.status(404).json({message:"Url not found"});
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
            console.error("Error updating Url state:", err);
            //return res.status(500).json({ message: "Internal Server error" }); only in prod
        }

    }
}

export default ShortUrlController;