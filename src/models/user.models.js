import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
 
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            //  string means cloudinary url
            type:String,   
            required:true
        },
        coverImage:{
            type:String
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            // Need encyption
            type:String,
            required:[true , 'Password is required']
        },
        refreshToken:{
            type:String
        }

        
  },
  {
    timestamps:true
  }
)

// before saving the data i want to encrpyt the password
// here (context and this) is needed therefore don't use arrow function for call back in pre because there is no refrence of context,this in arrow func
// PASSWORD ENCRYPTED
userSchema.pre("save" , async function(next){
    // if password field is not modified then move ahead
    if( !this.isModified("password")) return next();

   this.password = bcrypt.hash(this.password , 10)
   next()
})
// after saving encrypted password in database. checking the user's password (user wants do to some changes he will again send some string ) is equal to encrypted password (from database)
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password , this.password)
}


userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
        _id: this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
     process.env.ACCESS_TOKEN_SECRET,
     {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
     }
    )
}
userSchema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
        _id: this._id
    },
     process.env.REFRESH_TOKEN_SECRET,
     {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
     }
    )
}
// both refresh and access token works the same only refresh token is in database
// refresh tokens refresh many times therefore have less information


export const User = mongoose.model("User" , userSchema)