import { User } from "../modals/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken'


export const isAuthenticated=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        // console.log(token);

        if(!token){
            return next(new ErrorHandler("You need to Login to Access this Resource",401))
        }
        const decodedData=jwt.verify(token,"MYSECRETKEY");
        req.user=await User.findById(decodedData.id);
        next();


    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message,error.statusCode))
    }
}