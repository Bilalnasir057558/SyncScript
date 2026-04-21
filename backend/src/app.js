import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

// for making 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true // allows cookies to send in req
}));

// gives access to json req
app.use(express.json({
    limit: '16kb'
}));

// gives access to form data
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))

// serve static files like images/css/pdfs in 
app.use(express.static('public'));

// allows access to req.cookies
app.use(cookieParser());


export {app}