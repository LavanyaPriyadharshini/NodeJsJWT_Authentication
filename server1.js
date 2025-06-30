
const express=require('express');

const mongoose=require('mongoose');
const cors=require('cors');

const app=express();



app.use(express.json());

app.use(cors());

app.use('/uploads', express.static('uploads'));  // for uploading static files like profile images and pdf

const authroutes = require('./routes/auth'); //the auth.js is inside the routes folder


  app.use('/api/auth', authroutes);


//connect to database

mongoose.connect('mongodb://localhost:27017/JWT_Authentication' , {
     useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


  const PORT = 5000;

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));