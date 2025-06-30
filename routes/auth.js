
//here "auth" (auth.js) is the name of the controller in which we have various methods like Post register method and get methods etc

const express = require('express');
const bcrypt = require('bcryptjs'); // ✅ correct
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
//here inside the models folder i have created a user.js file where i specified the properties and model data,with the mongo database connection

const JWT_SECRET = 'ThisisthefirstjwtcodeprograminNodejs';

// Register
router.post('/register', async (req, res) => {  //this is a post method named as register
  try {
    const { name, DateofBirth, Age, Qualification, email, password } = req.body;

    const existingUser = await User.findOne({ email }); // ✅ fix

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10); // ✅ fix
    const hashedPassword = await bcrypt.hash(password, salt); // ✅ fix

    const newUser = new User({ // ✅ fix
      name,
      DateofBirth,
      Age,
      Qualification,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User Registered successfully' });
  } catch (err) {
    console.error(err); // Add this for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); // ✅ fix
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password); // ✅ fix
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err); // Add this too!
    res.status(500).json({ message: 'Server error' });
  }
});



// Get all Registerd users -GET method

router.get('/getAllUsers',async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    }

    catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
   }
  
});



//Get a user by id - GET method by id
//while checking in postman call like this "http://localhost:5000/api/auth/getUserById/68621aea3976fa7751281b9b"

router.get('/getUserById/:id' , async (req,res) => {
    try{
        const user=await User.findById(req.params.id);
if(!user) return res.status(404).json({message: "User not found"});

res.json(user);
    }

    catch(err){
        console.error(err);
        res.status(500).json({message : 'Server error'});
    }
});

module.exports = router;
