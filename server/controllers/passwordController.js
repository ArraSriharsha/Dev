import nodemailer from 'nodemailer';
import user from '../models/User.js';
import bcrypt from 'bcryptjs';

export const sendOTP = async (req, res) => {
    
    const { email } = req.body;
    const newuser = await user.findOne({Email : email});
    if (!newuser) {
        return res.status(404).json({ message: 'User not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    })
    const mailOptions = {   
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP for password reset',
        text: `Greetings from CodeArena!\nYour OTP for password reset is ${otp}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending email' });
        }
        return res.status(200).json({ message: 'OTP sent successfully', otp });
    })
}
export const resetPassword = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const newuser = await user.findOne({Email : email});
    try{
    if (!newuser) {
        return res.status(404).json({ message: 'User not found' });
    }
    newuser.Password = await bcrypt.hash(password, 10);
    await newuser.save();
    return res.status(200).json({ message: 'Password reset successfully' });
    }catch(error){
        return res.status(500).json({ message: 'Error in resetting password' });
    }
}