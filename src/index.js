// require ('dotenv').config({path: './env'})
import dotenv from "dotenv"

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";

import connectDb from "./db/index.js";

// in connectDb async is there which means it gives some response of promise pending , etc so you need to handel them while calling by .then and .catch
connectDb()
.then( () => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running at the port: ${process.env.PORT}`);
        
    })
})
.catch( (err) => {
   console.log("Mongo db connection failed !!!" , err); 
})


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