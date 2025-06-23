const mongoose  = require('mongoose');

const authenticationSchema = require('../../models/authentication/authenticationSchema');

const express = require('express');
const authenticationRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

authenticationRouter.post('/register', async (req, res) => {
  const { role, password } = req.body;

  if (!role || !password) {
    return res.status(400).json({ message: 'Role and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new authenticationSchema({ role, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});
authenticationRouter.post('/login', async (req, res) => {
  const { role, password } = req.body;

  if (!role || !password) {
    return res.status(400).json({ message: 'Role and password are required' });
  }

  try {
    const user = await authenticationSchema.findOne({ role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid role or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid role or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
authenticationRouter.get('/users', async (req, res) => {
  try {
    const users = await authenticationSchema.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});
authenticationRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { role, password } = req.body;

  if (!role || !password) {
    return res.status(400).json({ message: 'Role and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await authenticationSchema.findByIdAndUpdate(id, { role, password: hashedPassword }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});
authenticationRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await authenticationSchema.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = authenticationRouter;