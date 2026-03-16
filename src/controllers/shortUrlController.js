import ShortUrl from "../model/shortUrl.js";
import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdef'
const generateShortCode = customAlphabet(alphabet, 10);

const baseUrl = "http://localhost:3000"


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
}

export default ShortUrlController;