// here we give the model schema for the mongoose

const mongoose=require('mongoose');


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    DateofBirth: { type: Date, required: true },
    Age: { type: Number, required: true },
    Qualification: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  { collection: 'UserSignUP' } // ✅ correct placement: second argument
  //here if you want the same collection name and the registered values under this, then mention the collection explicitly here so that it wont convert the name in plural 
  //if you dont explicitly mention the created collection name as like you created in the mongo db ,then you will see an extra plural form of the collection name in the mongo db 
  //compass where the registered records will defaultly saved in the plural name of the collection., so to avoid these things we create the collection name
);

module.exports=mongoose.model('UserSignUP',userSchema);