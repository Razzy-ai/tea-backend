import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
// creating method for users registration
import {uploadOncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt from "jsonwebtoken";


// generating access and refresh token is common therefore created a function
 const generateAccessAndRefereshTokens = async(userId) => {
    
    try {
        // find user based on there id to create there access and referesh token
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // create tokens ( need paranthesis because they are methods)
       const  accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
    
        // storing refreshtoken in db (this is encoded vala refresh token joki user mai save kr rhe h)
        user.refreshToken = refreshToken
        // no need of validation just save the refresh token
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}

    } catch (error) {
        // console.error("Error details:", error);
        throw new ApiError(500 , "something went wrong while generating access and referesh tokens")
    }
 }

const registerUser = asyncHandler( async(req,res) => {
    // 1.get user details from the frontend
    // you can get data(user details according to the model created) from postman
    // 2.validation - field should not be empty
    // 3.check if users already exists : with the help of username,email 
    // 4.check for images (not compulsory) , check for avtar ( compulsory)
    // 5.If imgs,avatar is available then upload them in cloudinary which gives you an url for that img (again imp to check avatar is given or not)
    // 6.Create user object (why? in mongoose when i will send the data (Nosql database) data is in objects is created and updated ) - create entry in db
    // 7.Remove password and refresh token field from response (because encrypted password we have to send it in frontend (to other person) and dont want to send it to the user)
    // 8.check for user creation(register or not(response null) )
    // 9.if user created then return response

    // Step 1
    const {username,fullname,email,password} = req.body;
    console.log(email);
    console.log(password);

    // step 2
// [fullname, username, password, email]:         This creates an array containing the values of the four fields.
// .some( (field) => field?.trim() === "" ):      This checks if at least one field in the array meets the condition:
// CONDITIONS:-
// 1) field?.trim() === "": The field is empty or contains only spaces.
// 2) field?. ensures it doesn't crash if a field is undefined.
// 3) .trim() removes spaces at the beginning and end of the string.
// 4)  === "" checks if the trimmed string is empty.

    if([fullname,username,password,email].some(  (field)  => field?.trim() === ""  )
     ){
        throw new ApiError(404,"All fields are required")
     }
    


    // Step 3
    const existedUser = await User.findOne({
        $or: [{ username } , { email }]
    })
   if(existedUser){
    throw new ApiError(409 , "User with email and username already exist")
   }
   
   

    //    Step 4
    // localpath means it is still in server 
   const avatarLocalPath = req.files?.avatar[0]?.path
//    const coverImageLocalPath = req.files?.coverImage[0]?.path
//    console.log('req.files:', req.files);
 
//    TRADITIONAL if else
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage && req.files.coverImage.length>0)){
    coverImageLocalPath = req.files.coverImage[0].path;
   }


   
   if( !avatarLocalPath){
    throw new ApiError(400, "avatar field is required")
   }
      

    // step - 5
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)
    if( !avatar){
     throw new ApiError(400, "avatar field is required")
    }


    
    // step - 6
    // in this format user will be created in db 1) there be might an error (asyncHandler will handle that) 2) db is in another continent 
  const user = await  User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        // for avatar we check conditions but not for coverimg so in obj we are checking does url exist or not either keep it empty
        email,
        password,
        username: username.toLowerCase()
    })


    // step - 7
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // step - 8
     if( !createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user")
     }    


    //  step - 9
    return res.status(201).json(
        new ApiResponse( 200 , createdUser , "User registered successfully")
    )

})

 const loginUser = asyncHandler( async(req,res) => {
        //   TODO FOR USER LOGIN
        // 1] req body se data lo
        // 2]username , email h ki nhi(dono mese kisi ek pr login krva skte h but we can write one code so that it will work on both username or email base)
        // 3] find the user exist or not
        // 4]if exist verify password ( called login) and if not (sign up ) create new user account
        // 5] if password checks generate tokens and send to user and in db (refresh token stored) already generated in user model
        // 6]send tokens in secure cookies 

        // step 1
        const {email , username ,password} = req.body
        console.log(email);
        
        // step 2
        // if(!username && !email)  if you want both
        if(!(username || email)){
            throw new ApiError(400 , "username or email is required")
            
        }

        // step 3 (if you have to check both whether exist or not)
        const user = await User.findOne({
            $or:[{username} , {email}]
        })

        if(!user){
            throw new ApiError(404,"User does not exist")
        }
 
        // step 4 (if user exists check password already created in users model)
        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            throw new ApiError(401,"Invalid users credentials")
        }

        // step 5
        // creating a method for this because common work
        // user is a object
     const {accessToken,refreshToken} =  await generateAccessAndRefereshTokens(user._id)       
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
     
     // step 6 - (need to design the options of the cookies)
     const options = {
        // cookies can be modified by fronted before this
        httpOnly: true,
        secure: true
        // cookies can be modified by server only after this properties
     }

     return res
     .status(200)
     .cookie("accessToken" , accessToken , options)
     .cookie("refreshToken" , refreshToken , options)
     .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser , accessToken , refreshToken
                // when user wants to save acessToken and resfreshToken in local storage
                // even in moblie apps cookies are unable to send
            },
            // message
            "User logged in successfully"
        )
     )
 })
  
//    Log Out process
 const logOutUser = asyncHandler (async (req,res) => {
    //  need to clear cookies(manage by server by http)
    // first we find user from there id but we dont have id . what to do ? Use middleWare

   await User.findByIdAndDelete(
        // from where to find 
        req.user._id,
        { 
            // where you need to update
            $set:{
                refreshToken:undefined
            }
        },
        {
            // need new updated values so that refreshToken will be undefined
            new:true
        }

    )

    const options = {
        // cookies can be modified by fronted before this
        httpOnly: true,
        secure: true,
        // cookies can be modified by server only after this properties
     }

     return res
     .status(200)
    //  need to pass options to
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200 , {} , "User logged Out"))

 })


//  creating refresh , access token ka endpoint
const refreshAccessToken = asyncHandler ( async(res,req) => {
 
    // extracting refresh token from cookies or either body ( if someone using mobile apps)
    const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

    if(incomingRefreshToken){
        throw new ApiError(401 , "Unauthorized Request")
    }
    
    try {

        // now verifying the access token using jwt (search jwt watch encoded and decoded information)
        // i need decoded info from jwt bcz encoded info joki user k pass h vo different hogi compare kare db se toh , qki vo info encode ki gyi h 
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
     
        // now refresh token is decoded (able to read info) sari info mere pass aa gyi
        // refresh token mai bhi hamre pass sirf id ka access h (look in user.model file where we generated access&refresh tokens )
        // if id ka access hai then  mongodb se query marke user ki info milegi
       const user = await User.findById(decodedToken?._id)
       
       if(!user){
        throw new ApiError(401 , "Invalid refresh token")
    }
     
    // matching the tokens
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401 , "refresh token is expired or used")
      }
        
    //    now agr client token == db token we have to generate new tokens
    // keep options bcz cookies mai send krna h
       const options = {
        httpOnly: true,
        secure:true
       }
    
        const {accessToken , newRefreshToken}  = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , newRefreshToken , options)
        .json(
            new ApiResponse(
                200,
                {accessToken , refreshToken : newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid refresh token")
    }

})





export {registerUser , loginUser , logOutUser , refreshAccessToken}
