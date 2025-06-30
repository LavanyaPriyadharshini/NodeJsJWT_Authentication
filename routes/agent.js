

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require('../models/Agent');

const User1=require('../models/User'); // for jionig the two collection and taking the names common we are using this.

const JWT_SECRET = 'ThisisthefirstjwtcodeprograminNodejs';

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload to /uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ====================================================
// ✅ Register user (JSON only) -----------------------
// POST http://localhost:5000/api/auth/register
// Content-Type: application/json
router.post('/register', async (req, res) => {
  try {
    const { name, DateofBirth, Age, Qualification, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      DateofBirth,
      Age,
      Qualification,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User Registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====================================================
// ✅ Upload profile image (AFTER registration) -------
// POST http://localhost:5000/api/auth/uploadProfileImage/:id
// Content-Type: multipart/form-data
// Form field: profileImage (File)
router.post('/uploadProfileImage/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.id;
    const imagePath = req.file ? req.file.path : null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imagePath },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'Profile image uploaded successfully',
      user: updatedUser,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====================================================
// ✅ Login -------------------------------------------
// POST http://localhost:5000/api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id }; //in this you can specify the payload with username, role, etc
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====================================================
// ✅ Get all users -----------------------------------
// GET http://localhost:5000/api/auth/getAllUsers
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====================================================
// ✅ Get user by ID ----------------------------------
// GET http://localhost:5000/api/auth/getUserById/:id
router.get('/getUserById/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Build full public URL if image exists
    const imageUrl = user.profileImage
      ? `${req.protocol}://${req.get('host')}/${user.profileImage}`
      : null;

    // Send a custom JSON response including the full URL
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      DateofBirth: user.DateofBirth,
      Age: user.Age,
      Qualification: user.Qualification,
      profileImageUrl: imageUrl // ✅ your usable image link
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




//update the values -- Update method

router.put('/updateUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Extract fields you want to update from request body
    const {
      name,
      DateofBirth,
      Age,
      Qualification,
      email,
      password // ⚠️ Usually you’d hash password here!
    } = req.body;

    // Build the update object dynamically
    const updateFields = {};

    if (name) updateFields.name = name;
    if (DateofBirth) updateFields.DateofBirth = DateofBirth;
    if (Age) updateFields.Age = Age;
    if (Qualification) updateFields.Qualification = Qualification;
    if (email) updateFields.email = email;
    if (password) updateFields.password = password; // Normally you’d hash it here!

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      //$set is a MongoDB update operator → it means:
      // /“Set the given fields to these new values.”

      { new: true } // ✅ Return the updated doc
      // tells Mongoose: Please return the updated version instead.”


    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// ----------------- jion operation like in sql server by combining both collections ----------------

// How it works
// User.distinct('Age') → gets an array of unique ages in UserSignUP

// $in → finds AgentDetails where Age is in that array

// You can return both results in one response.

router.get('/getcommonField', async (req, res) => {
  try {
    // 1️⃣ Get all unique ages from UserSignUP
    const userAges = await User1.distinct('Age'); //this record taken from the userSignup collection and the user model

    // 2️⃣ Find all AgentDetails with matching ages
    const matchingAgents = await User.find({ //fetch and compare from the AgentDetails collection
      Age: { $in: userAges }
    });

    // 3️⃣ Also find all UserSignUP with those ages (optional)
    const matchingUsers = await User1.find({ //this uses user sign up model
      Age: { $in: userAges }
    });

    res.json({
      matchingUsers,
      matchingAgents
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
