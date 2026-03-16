import express from 'express';
import shortUrls from "./shortUrlRoutes.js";

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Welcome"));

    app.use(express.json(), shortUrls);
}

export default routes;