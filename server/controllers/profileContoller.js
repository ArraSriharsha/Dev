import user from '../models/User.js';
import jwt from 'jsonwebtoken';

export const getProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({message: "No token found"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const id = decoded.userId;
        const profile = await user.findById(id);
        res.status(200).json({
            username: profile.Username,
            firstname: profile.FirstName,
            lastname: profile.LastName,
            email: profile.Email,
            phoneno: profile.PhoneNumber,
            role: profile.Role,
            createdAt: profile.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const {id} = req.user;
        const {FirstName, LastName, Email, Username, PhoneNumber} = req.body;
        //check if all fields are provided
        if(!FirstName || !LastName || !Email || !Username || !PhoneNumber) {
            return res.status(400).json({
                message: "Please provide all required fields",
                received: req.body
            });
        }

        //check if username already exists
        const UsernameExists = await user.findOne({Username});
        if(UsernameExists && UsernameExists._id.toString() !== id) {
            return res.status(400).json({message: "Username already exists"});
        }

        //check if email already exists
        const EmailExists = await user.findOne({Email});
        if(EmailExists && EmailExists._id.toString() !== id) {
            return res.status(400).json({message: "Email already exists"});
        }
        
        const newUser = await user.findByIdAndUpdate(id, {FirstName, LastName, Email, Username, PhoneNumber}, {new: true});

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

        res.status(200).json({message: "You have successfully Updated your Profile",newUser});

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({message: "Error updating profile"});
    }
}
export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.user;
        res.clearCookie('token');
        await user.findByIdAndDelete(id);
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile' });
    }
}