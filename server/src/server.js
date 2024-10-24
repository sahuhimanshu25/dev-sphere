import express from 'express'
import dotenv from 'dotenv'
import { connection } from './database/connection.js'
import { app } from './app.js'
dotenv.config({path:'../.env'})
const PORT=process.env.PORT
connection().then(()=>{
    app.on("error",(error)=>{
        console.log('Error:',error);
        throw new error
    })
    app.listen(PORT,()=>{
        console.log(`App listening at port ${PORT}`);
    })
    console.log('Database connected successfully');
}).catch((err)=>{
    console.log('DataBase Connection failed '+ err.message);
})
// app.listen(PORT,()=>{
//     console.log('SERVER RUNNING ON PORT : ',PORT);
// })