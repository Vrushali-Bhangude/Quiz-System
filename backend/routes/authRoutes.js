const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/userModel');

// @route    POST /api/auth/register
// @desc     Register a new user (with plain text password storage)
// @access   Public
router.post('/register', [
  // Validation
  check('full_name', 'Full name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('mobile_number', 'Mobile number is required').not().isEmpty(),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { full_name, email, password, mobile_number, address, gender, date_of_birth } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user with plain text password (INSECURE)
    user = new User({
      full_name,
      email,
      password, // Storing plain text password
      mobile_number,
      address: address || '',
      gender: gender || '',
      date_of_birth: date_of_birth || null
    });

    // 3. Save to database (password will be stored in plain text)
    await user.save();

    // 4. Return user data (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse
    });

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST /api/auth/login
// @desc     Authenticate user (with plain text password comparison)
// @access   Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare plain text passwords (INSECURE)
    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Return user data (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      user: userResponse
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;