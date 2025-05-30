import nodemailer from 'nodemailer';

export const sendMessage = async (req, res) => {
    const { username, email, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'teamcodearena@gmail.com',
        subject: 'New Message from ' + username,
        text: `Username: ${username}\nEmail: ${email}\nMessage: ${message}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({ message: 'Failed to send message' });
        } else {
            res.status(200).json({ message: 'Message sent successfully' });
        }
    });
}