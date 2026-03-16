import express from 'express';
import ShortUrlController from '../controllers/shortUrlController.js';

const routes = express.Router();

//rotas get post, ...
routes.post("/shorten", ShortUrlController.createShortUrl)
routes.get("/:shortCode", ShortUrlController.redirectFromShortUrl)

export default routes;