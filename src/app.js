import express from 'express';
import swaggerUi from 'swagger-ui-express';
import connectToDB from "./config/database.js";
import routes from "./routes/index.js";
import swaggerSpec from "./config/swagger.js";

const connection = await connectToDB();

connection.on('error', (err) => {
    console.error("Connection Error",err);
})

connection.once('open', () => {
    console.log('Connection Connected');
})

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
routes(app);


export default app;