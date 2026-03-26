import express from 'express';
import ShortUrlController from '../controllers/shortUrlController.js';
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";

const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {message: 'Too many requests, please try again later'},
})

const routes = express.Router();

/**
 * @openapi
 * /shorten:
 *   post:
 *     summary: Create a short URL
 *     description: Creates a new short URL entry. A custom shortCode can be provided; if omitted, one is auto-generated using nanoid.
 *     tags:
 *       - Short URLs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *             properties:
 *               longUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://www.example.com/some/very/long/path
 *               shortCode:
 *                 type: string
 *                 example: myalias
 *     responses:
 *       200:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: shortUrl created successfully
 *                 shortUrl:
 *                   $ref: '#/components/schemas/ShortUrl'
 *                 newUrl:
 *                   type: string
 *                   example: http://localhost:3000/a1b2c3d4e5
 *       400:
 *         description: Missing or invalid longUrl
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             examples:
 *               missing:
 *                 value: { message: longUrl is required }
 *               invalid:
 *                 value: { message: The LongUrl is not a valid URL }
 *       409:
 *         description: Short code already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Short Url already exists
 *       500:
 *         description: Internal server error
 */
routes.post("/shorten", writeLimiter, ShortUrlController.createShortUrl);

/**
 * @openapi
 * /details/{shortCode}:
 *   get:
 *     summary: Get short URL details
 *     description: Returns all stored details for a given short code, including access count and active state.
 *     tags:
 *       - Short URLs
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code identifier
 *         example: a1b2c3d4e5
 *     responses:
 *       200:
 *         description: Short URL details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrlDetails:
 *                   $ref: '#/components/schemas/ShortUrl'
 *       404:
 *         description: Short code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Url not found
 */
routes.get("/details/:shortCode", ShortUrlController.getDetails); // before "/:shortcode" so router don't make mistakes

/**
 * @openapi
 * /urls:
 *   get:
 *     summary: List authenticated user's URLs
 *     description: Returns a paginated list of short URLs created by the authenticated user.
 *     tags:
 *       - Short URLs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page (max 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, accessCount]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Paginated list of URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShortUrl'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Authentication required
 */
routes.get("/urls", requireAuth, ShortUrlController.listUrls); // before "/:shortcode" so router don't mistake it as a shortCode

/**
 * @openapi
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     description: Redirects the client to the original long URL associated with the given short code. Increments the access counter on each visit.
 *     tags:
 *       - Short URLs
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code identifier
 *         example: a1b2c3d4e5
 *     responses:
 *       301:
 *         description: Redirects to the original long URL
 *       404:
 *         description: Short code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Url not found
 *       410:
 *         description: Short URL exists but is inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Url is not active
 */
routes.get("/:shortCode", ShortUrlController.redirectFromShortUrl);

/**
 * @openapi
 * /state/{id}:
 *   patch:
 *     summary: Toggle active state
 *     description: Enables or disables a short URL by setting its isActive field. A disabled URL returns 410 on access.
 *     tags:
 *       - Short URLs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the short URL document
 *         example: 664f1a2b3c4d5e6f7a8b9c0d
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: State updated (or already as desired)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Url State updated
 *                     shortUrl:
 *                       $ref: '#/components/schemas/ShortUrl'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Url State is already as desired
 *       400:
 *         description: Invalid ID format or missing/invalid isActive field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             examples:
 *               invalidId:
 *                 value: { message: Invalid ID format }
 *               missingField:
 *                 value: { message: "The field 'isActive' is required in the body" }
 *               invalidType:
 *                 value: { message: IsActive field must be a boolean }
 *       404:
 *         description: Short URL not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Url not found
 */
routes.patch("/state/:id", writeLimiter, requireAuth, ShortUrlController.updateState);

/**
 * @openapi
 * /update/{id}:
 *   put:
 *     summary: Update short URL
 *     description: Updates the shortCode and/or longUrl of an existing short URL entry. At least one field must be provided.
 *     tags:
 *       - Short URLs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the short URL document
 *         example: 664f1a2b3c4d5e6f7a8b9c0d
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shortCode:
 *                 type: string
 *                 example: newcode
 *               longUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://www.new-destination.com/path
 *     responses:
 *       200:
 *         description: Short URL updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: shortUrl updated
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             examples:
 *               missingFields:
 *                 value: { message: ShortCode or longUrl is required }
 *               invalidUrl:
 *                 value: { message: The LongUrl is not a valid URL }
 *               emptyShortCode:
 *                 value: { message: ShortCode must be a non-empty string }
 *       404:
 *         description: Short URL not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Url not found
 *       409:
 *         description: New shortCode already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: This shortCode is already in use
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal Server Error
 */
routes.put("/update/:id", writeLimiter, requireAuth, ShortUrlController.updateShortUrl);

export default routes;