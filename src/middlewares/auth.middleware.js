// this middleware will verify does the user exist or not so that we can use this middleware for log out process
// why verifying jwt ? bcz while login we gave tokens to user now we have to check does that tokens correct or not
// if that have true login or tokens are correct then i will add  new object in req.body

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";


//  res can be written as _ 
 export const verifyJWT =  asyncHandler( async(req,_,next) => 
       
    {
         //  need try catch because its database operation

       try {
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
//         console.log("Cookies:", req.cookies);
// console.log("Authorization Header:", req.header("Authorization"));

//         console.log(token);
console.log("Token Received:", token);
console.log("ACCESS_TOKEN_SECRET (from env):", process.env.ACCESS_TOKEN_SECRET);

        
 
      if(!token){
           throw new ApiError(401 , "Unauthorized request")
      }
 
     //  if token mila
       const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
       console.log("Decoded Token:", decodedToken);
   //     if (!decodedToken) {
   //       throw new ApiError(401, "Unauthorized: Invalid token");
   //   }
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
     //  _id already created in user controller
 
      if(!user){
         throw new ApiError(401 , "Invalid Access Token")
      }
      
   

 
     //   adding one object so that you will use this in logout method to get userid bcz now u have access for req.user At first u have only req.body
     req.user = user
     next()
       } catch (error) {
        throw new ApiError(401 , error?.message || "invalid access token")
       }
    })

