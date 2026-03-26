import express from 'express';
import AuthController from '../controllers/authController.js';
import { requireAuth } from "../middleware/auth.js";

const routes = express.Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.get('/me', requireAuth, AuthController.me);

export default routes;