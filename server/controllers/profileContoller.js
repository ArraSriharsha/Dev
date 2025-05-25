import user from '../models/User.js';

export const getProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const profile = await user.findById(id);
        res.status(200).json({
            username: profile.Username,
            name: profile.FirstName + ' ' + profile.LastName,
            email: profile.Email,
            phoneno: profile.PhoneNumber,
            role: profile.Role,
            createdAt: profile.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
}
