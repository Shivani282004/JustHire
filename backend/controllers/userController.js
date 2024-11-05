// Controller: userController.js

import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Register a new user
export const registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ 
            message: 'Validation Error: All fields (email, password, role) are required.' 
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Conflict Error: A user with this email already exists.' 
            });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully!' 
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ 
            message: 'Server Error: Unable to register user.', 
            error: error.message || 'Unknown error' 
        });
    }
};

// User login
export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ 
            message: 'Validation Error: Email, password, and role are required.' 
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Authentication Error: Invalid email or password.' 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Authentication Error: Invalid email or password.' 
            });
        }

        if (user.role !== role) {
            return res.status(403).json({
                message: 'Authorization Error: Role does not match.',
            });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            role: user.role 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server Error: Unable to login user.', 
            error: error.message 
        });
    }
};

export const getUserById = async(req, res)=> {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
    try {
        // Ensure you are only passing req.params.id, not req.params itself.
        const user = await User.findById(req.params.id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
}
