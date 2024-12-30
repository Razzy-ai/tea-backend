import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

// 4 configurations
// Data can be come in json format , from url 
// accepting the data in json format with limit 
app.use(express.json({Limit: "16kb"}))
app.use(express.urlencoded({extended:true , limit: "16kb"}))

// public named folder is there to store favicons, imgs,files,etc
app.use(express.static("public"))
app.use(cookieParser())





// routes import
import userRouter from "./routes/user.routes.js"
// routes declaration
// app.use("/users" , userRouter)
// how website made
// http://localhost:8000/users/register

app.use("/api/v1/users" , userRouter)
// http://localhost:8000/api/v1/users/register



export {app}