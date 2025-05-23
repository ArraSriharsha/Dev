import jwt from 'jsonwebtoken';
import user from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No Token Found' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            // Get user from token
            const USER = await user.findById(decoded.userId).select('-Password');
            if (!USER) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Add user to request object
            req.user = USER;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Error in authentication middleware' });
    }
}; 