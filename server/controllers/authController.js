import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register Controller
export const signup = async (req, res) => {
    try {
        const {FirstName, LastName, Email, Username, Password, PhoneNumber} = req.body;
        //check if all fields are provided
        if(!FirstName || !LastName || !Email || !Username || !Password || !PhoneNumber) {
            return res.status(400).json({
                message: "Please provide all required fields",
                received: req.body
            });
        }

        //check if username already exists
        const UsernameExists = await User.findOne({Username});
        if(UsernameExists) {
            return res.status(400).json({message: "Username already exists"});
        }

        //check if email already exists
        const EmailExists = await User.findOne({Email});
        if(EmailExists) {
            return res.status(400).json({message: "Email already exists"});
        }

        //hash password // to prevent rainbow table attack uncommon passwords
        const hashedPassword = await bcrypt.hash(Password, 10);
        
        const newUser = await User.create({
            FirstName,
            LastName,
            Email,
            Username,
            Password: hashedPassword,
            PhoneNumber,
        });

        const token = jwt.sign(
            {userId: newUser._id, username: newUser.Username, role: newUser.Role}, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'}
        );
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            message: "Account has been Created Successfully",
            user: {
                id: newUser._id,
                username: newUser.Username,
                role: newUser.Role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({message: "Error creating user"});
    }
};

// Login Controller
export const signin = async (req, res) => {
    try {
        const {login, password} = req.body;
        
        if(!login || !password) {
            return res.status(400).json({message: "Please provide login credentials and password"});
        }

        const user = await User.findOne({
            $or: [
                { Email: login.toLowerCase() },
                { Username: login }
            ]
        });
        
        if(!user) {
            return res.status(401).json({message: "Invalid login credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if(!isMatch) {
            return res.status(401).json({message: "Invalid login credentials"});
        }

        const token = jwt.sign(
            {userId: user._id, username: user.Username, role: user.Role},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        );
    
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.Username,
                role: user.Role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: "Error during login"});
    }
};

// Logout Controller
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error during logout' });
    }
}; 