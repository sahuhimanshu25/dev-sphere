import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({path:'../.env'})

export const connection = mongoose
  .connect(`${process.env.CONNECTION_STRING}`)
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => console.log(e));
