import express from 'express';
import swaggerUi from 'swagger-ui-express';
import connectToDB from "./config/database.js";
import routes from "./routes/index.js";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { attachUser } from "./middleware/auth.js";

const connection = await connectToDB();

connection.on('error', (err) => {
    console.error("Connection Error",err);
})

connection.once('open', () => {
    console.log('Connection Connected');
})

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',') : '*';

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(attachUser);

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 200,
    message: {message: 'Too many requests, please try again later'},
})

app.use(globalLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
routes(app);

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({message: 'Internal server error'});
    }
    return res.status(500).json({message: err.message, stack: err.stack});
})

export default app;