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

export {api}