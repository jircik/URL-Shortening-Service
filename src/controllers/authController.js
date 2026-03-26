import User from '../model/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {

    static async register(req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'email and password are required'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({
                email,
                password: hashedPassword
            });

            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d'});

            return res.status(201).json({token})
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({ message: 'Email already in use' });
            }
            next(err);
        }
    }

    static async login(req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'email and password are required'});
        }

        try {
            const user = await User.findOne({email});


            if (!user) {
                return res.status(401).json({message: 'invalid credentials'});
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({message: 'invalid credentials'});
            }

            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d'});

            return res.status(200).json({token})

        } catch (err) {
            next(err);
        }
    }

    static async me(req, res, next) {
        const { _id, email, createdAt } = req.user;

        return res.status(200).json({_id, email, createdAt});
    }
}

export default AuthController;