import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    
},{timestamps:true})

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password=await bcrypt.hash(this.password,10);

})


//JWT TOKEN

userSchema.methods.getJWT=function(){
    return jwt.sign({id:this._id},"MYSECRETKEY",{
        expiresIn:"5d"
    })
}


userSchema.methods.comparePassword=async function(entered){
    return await bcrypt.compare(entered,this.password)
}


export const User=new mongoose.model('User',userSchema);