import user from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
    try {
        const { id } = req.user;
        const currentUser = await user.findById(id).select('Role');
        
        if (currentUser.Role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource'
            });
        }

        const users = await user.find().select('-Password');
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching users'
        });
    }
};


export const createUser = async (req, res) => {
    try {
        const {FirstName, LastName, Email, Username, Password, PhoneNumber,Role} = req.body;
        //check if all fields are provided
        if(!FirstName || !LastName || !Email || !Username || !Password || !PhoneNumber) {
            return res.status(400).json({
                message: "Please provide all required fields",
                received: req.body
            });
        }

        //check if username already exists
        const UsernameExists = await user.findOne({Username});
        if(UsernameExists) {
            return res.status(400).json({message: "Username already exists"});
        }

        //check if email already exists
        const EmailExists = await user.findOne({Email});
        if(EmailExists) {
            return res.status(400).json({message: "Email already exists"});
        }

        //hash password // to prevent rainbow table attack uncommon passwords
        const hashedPassword = await bcrypt.hash(Password, 10);
        
        const newUser = await user.create({
            FirstName,
            LastName,
            Email,
            Username,
            Password: hashedPassword,
            PhoneNumber,
            Role
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
export const updateUser = async (req, res) => {
    try {
        const { id } = req.user;
        const currentUser = await user.findById(id).select('Role');
        
        if (currentUser.Role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update users'
            });
        }

        const { userId } = req.params;
        const { FirstName, LastName, Email, Username, Password, PhoneNumber, Role } = req.body;

        const userToUpdate = await user.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email or username is being changed and if it's already taken
        if (Email !== userToUpdate.Email || Username !== userToUpdate.Username) {
            const existingUser = await user.findOne({
                $or: [
                    { Email, _id: { $ne: userId } },
                    { Username, _id: { $ne: userId } }
                ]
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email or username is already taken'
                });
            }
        }
        if(Password) {
            const hashedPassword = await bcrypt.hash(Password, 10);
            userToUpdate.Password = hashedPassword;
        }
        // Update fields
        if (FirstName) userToUpdate.FirstName = FirstName;
        if (LastName) userToUpdate.LastName = LastName;
        if (Email) userToUpdate.Email = Email;
        if (Username) userToUpdate.Username = Username;
        if (PhoneNumber) userToUpdate.PhoneNumber = PhoneNumber;
        if (Role) userToUpdate.Role = Role;

        await userToUpdate.save();
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: userToUpdate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating user'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.user;
        const currentUser = await user.findById(id).select('Role');
        
        if (currentUser.Role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete users'
            });
        }

        const { userId } = req.params;
        const userToDelete = await user.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if(userId === id) {
            await userToDelete.deleteOne();
            res.clearCookie('token');
            return res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        await user.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting user'
        });
    }
}; 