import express from 'express';
import shortUrls from "./shortUrlRoutes.js";

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     description: Returns a welcome message to confirm the API is running.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is up and running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Welcome
 */
const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Welcome"));

    app.use(express.json(), shortUrls);
}

export default routes;