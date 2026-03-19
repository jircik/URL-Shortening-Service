import express from 'express';
import ShortUrlController from '../controllers/shortUrlController.js';
import shortUrlController from "../controllers/shortUrlController.js";

const routes = express.Router();

//rotas get post, ...
routes.post("/shorten", ShortUrlController.createShortUrl)
routes.get("/details/:shortCode", ShortUrlController.getDetails) // before "/:shortcode" so router don't make mistakes
routes.get("/:shortCode", ShortUrlController.redirectFromShortUrl)
routes.patch("/state/:id", shortUrlController.updateState)
routes.put("/update/:id", shortUrlController.updateShortUrl)

export default routes;