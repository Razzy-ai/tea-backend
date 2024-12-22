// require ('dotenv').config({path: './env'})
import dotenv from "dotenv"

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";

import connectDb from "./db/index.js";

connectDb()


dotenv.config({
    path: './env'
})





/*
                 First approach to connect databse everything in the index.js file
import express from "express"
const app = express()

( async() => {
      
    try {
       await  mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

       app.on("OMG errorrr " , (error) => {
        console.log("ERRRRR: " , error);
        throw error
       })
       
       app.listen(process.env.PORT , () => {
        console.log(`App is listening on port ${process.env.PORT}`);
        
       })


    } catch (error) {
        console.log("Oh ERROR: ", error);
        throw error
        
    }
})()


*/