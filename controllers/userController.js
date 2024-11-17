import User from '../models/user.js';
import bcrypt from 'bcryptjs';


// Create a new user
export const createUser = async (req, res) => {
    try {
        const {
            username, email, phoneNumber, password, firstname, lastname, sexe, xp, garentie, status 
        } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with default values for optional fields
        const user = await User.create({
            username,
            email,
            phoneNumber: phoneNumber || '', // Optional fields can have defaults if needed
            password: hashedPassword,
            firstname: firstname || '',
            lastname: lastname || '',
            sexe: sexe !== undefined ? sexe : null, // Set default for optional fields
            xp: xp || 0,
            garentie: garentie === true,
            status: status !== false, // Default to true if undefined
        });

        // Return the user object without the password
        const { password: _, ...userWithoutPassword } = user.toObject(); // Exclude password from response
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error creating user:', error); // Log the error for debugging
        res.status(500).json({ error: 'Unable to create user', details: error.message });
    }
};


// Get all users with pagination
export const findAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const size = parseInt(req.query.pageSize) || 10; // Default page size to 10
        const limit = size;
        const offset = (page - 1) * size;

        // Fetch users with pagination
        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            attributes: { exclude: ['password'] } // Exclude password from response
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            totalItems: count,
            totalPages,
            currentPage: page,
            users: rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch users', details: error.message });
    }
};

// Get a user by ID
export const findUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] } // Exclude password from response
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch user', details: error.message });
    }
};

// Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const { username, email, phoneNumber, password, firstname, lastname, sexe, xp, garentie, status } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields only if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (password) user.password = await bcrypt.hash(password, 10); // Hash new password if provided
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (sexe !== undefined) user.sexe = sexe;
        if (xp !== undefined) user.xp = xp;
        if (garentie !== undefined) user.garentie = garentie;
        if (status !== undefined) user.status = status;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update user', details: error.message });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete user', details: error.message });
    }
};
