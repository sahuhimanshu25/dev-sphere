import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../middlewares/jwtToken.js";



export const registerUser=async(req,res,next)=>{
    try {
        
        const {username,email,password}=req.body;
        const user=await User.create({
            username,email,password,
            
        });

        sendToken(user,201,res);


    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}




//LOGIN
export const loginUser=async(req,res,next)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return next(new ErrorHandler("Invalid Email or password"));
        }



        const user=await User.findOne({email}).select("+password");
        // console.log(password);
        if(!user){
            return next(new ErrorHandler("Invalid Email or password"));
        }
        
        const isPasswordsMatch = await user.comparePassword(password);

        if(!isPasswordsMatch){
            return next(new ErrorHandler("Invalid emaail or password",401))
        }

        sendToken(user,200,res);


    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}



//LOGOUT


export const logout=async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })


    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
}



//GET USER DETAILS
export const getUserDetails=async(req,res,next)=>{
    try {
        
        const user=await User.findById(req.user.id);
        console.log(user);
        res.status(200).json({
            success:true,
            user,
        })

    } catch (error) {
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}

export const searchUser = async (req, res, next) => {
    try {
        const keyword = req.query.username
            ? {
                username: {
                    $regex: req.query.username,
                    $options: "i"
                }
            }
            : {};

        const users = await User.find(keyword);

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
