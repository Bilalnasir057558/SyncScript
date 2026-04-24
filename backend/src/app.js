import express, {json} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

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

// Route import
import userRouter from "./routes/user.routes.js";
import vaultRouter from "./routes/vault.routes.js";

// Route declaration -> it sends control to the user router. 
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vaults', vaultRouter);

export {app}