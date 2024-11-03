import User from '../models/User.js'; // Ensure you are using the correct path

// Register a new user
export const registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password || !role) {
        return res.status(400).json({ 
            message: 'Validation Error: All fields (email, password, role) are required.' 
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Conflict Error: A user with this email already exists.' 
            });
        }

        // Create and save the new user
        const newUser = new User({ email, password, role });
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully!' 
        });
    } catch (error) {
        console.error('Error during user registration:', error); // Log the error
        res.status(500).json({ 
            message: 'Server Error: Unable to register user.', 
            error: error.message || 'Unknown error' 
        });
    }
};



// User login
export const loginUser = async (req, res) => {
    const { email, password, role } = req.body; // Include role in request body

    // Input validation
    if (!email || !password || !role) {
        return res.status(400).json({ 
            message: 'Validation Error: Email, password, and role are required.' 
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Authentication Error: Invalid email or password.' 
            });
        }

        // Check password match
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Authentication Error: Invalid email or password.' 
            });
        }

        // Check if the user's role matches
        if (user.role !== role) {
            return res.status(403).json({
                message: 'Authorization Error: Role does not match.',
            });
        }

        // Login successful
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
