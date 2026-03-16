import express from 'express';
import connectToDB from "./config/database.js";
import routes from "./routes/index.js";

const connection = await connectToDB();

connection.on('error', (err) => {
    console.error("Connection Error",err);
})

connection.once('open', () => {
    console.log('Connection Connected');
})

const app = express();
routes(app);


export default app;