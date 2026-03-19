import express from 'express';
import ShortUrlController from '../controllers/shortUrlController.js';
import shortUrlController from "../controllers/shortUrlController.js";

const routes = express.Router();

//rotas get post, ...
routes.post("/shorten", ShortUrlController.createShortUrl)
routes.get("/details/:shortCode", ShortUrlController.getDetails) // before "/:shortcode" so router don't make mistakes
routes.get("/:shortCode", ShortUrlController.redirectFromShortUrl)
routes.patch("/state/:id", shortUrlController.toggleState)

export default routes;