import nodemailer from 'nodemailer';
import user from '../models/User.js';
import OTP from '../models/OTP.js';
import bcrypt from 'bcryptjs';

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const newuser = await user.findOne({Email: email});
        if (!newuser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in database
        await OTP.findOneAndUpdate(
            { email },
            { otp },
            { upsert: true, new: true }
        );

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        const mailOptions = {   
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for password reset',
            text: `Greetings from CodeArena!\nYour OTP for password reset is ${otp}\nThis OTP will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Error sending OTP' });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Find the OTP in database
        const otpRecord = await OTP.findOne({ email });
        
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP Expired' });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Delete the OTP after successful verification
        await OTP.deleteOne({ email });

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Error verifying OTP' });
    }
};

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
};