import express from 'express';
import { createUser, findAllUsers, findUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Create a new user
router.post('/users', createUser);

// Get all users
router.get('/users', findAllUsers);

// Get a user by ID
router.get('/users/:id', findUserById);

// Update a user by ID
router.put('/users/:id', updateUser);

// Delete a user by ID
router.delete('/users/:id', deleteUser);

export default router;
