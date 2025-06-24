
const express=require('express');

const mongoose=require('mongoose');
const cors=require('cors');

const authroutes=require('./auth/routes');

const app=express();

app.use(cors());
app.use(express.json());


//connect to database

mongoose.connect('mongodb://localhost:27017/JWT_Authentication' , {
     useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  app.use('/api/auth', authroutes);

  const PORT = 5000;

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));