import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb  = async () => {

    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODb_URL}/${DB_NAME}`)
       console.log(`Mongodb connected !! DB HOST : ${connectionInstance.connection.host}`);
       
    } catch (error) {
        console.log("mongodb connection error: " , error);
        process.exit(1)
        
    }
}

export default connectDb