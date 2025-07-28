import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter your username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    followers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    avatar:{
        type:String,
        required:true
    },
    avatarPublicId:{
        type:String
    },
    verificationCode:{
        type:Number,
    },
    bio:{
        type:String,
    }
},{timestamps:true});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password=await bcrypt.hash(this.password,10);

})


//JWT TOKEN
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;
if (process.env.NODE_ENV !== 'production') {
    console.log("JWT Secret loaded");
}
userSchema.methods.getJWT=function(){
    return jwt.sign({id:this._id},JWT_SECRET,{
        expiresIn:"5d"
    })
}


userSchema.methods.comparePassword=async function(entered){
    return await bcrypt.compare(entered,this.password)
}
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.__v;
        delete ret.verificationCode;
        delete ret.avatarPublicId; // optional, if you don’t want to expose it
        return ret;
    }
});


export const User=new mongoose.model('User',userSchema);