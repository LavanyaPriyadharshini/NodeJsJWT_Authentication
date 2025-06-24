// here we give the model schema for the mongoose

const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    Username : {type:String, requires:true,unique:true},
    email : {type:String, requires:true,unique:true},
    password:{type:String, required:true},
});

module.exports=mongoose.model('User',userSchema);