import express from 'express'
import dotenv from 'dotenv'

import { connection } from './database/connection.js'
import { app } from './app.js'
dotenv.config({path:'../.env'})

const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log('SERVER RUNNING ON PORT : ',PORT);
    
})