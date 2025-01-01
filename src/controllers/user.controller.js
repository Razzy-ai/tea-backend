import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";

// creating method for users registration

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
    const existedUser = User.findOne({
        $or: [{ username } , { email }]

    })
   if(existedUser){
    throw new ApiError(409 , "User with email and username already exist")
   }
   console.log(existedUser);
   

    //    Step 4
    req.files?.avatar[0]?.path
      
})

export {registerUser}
