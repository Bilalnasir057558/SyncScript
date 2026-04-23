import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";


const verifyJWT = async (req, res, next) => {
    try {
        
        if(!req.cookies.accessToken) {
            throw new ApiError(400, 'Unauthorized request.');
        }

        // get access token from cookies or header (in phones)
        const accessToken = req.cookies?.accessToken || req.header('Authorization').replace('Bearer ', '');

        if(!accessToken) {
            throw new ApiError(400, 'Unauthorized request.');
        }

        // if token present => verify it
        const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if(!decoded) {
            throw new ApiError(400, 'Access token is invalid.');
        }

        // if access token is valid => get user details from it
        const user = await User.findById(decoded._id).select("-password");

        if(!user) {
            throw new ApiError(400, 'Access token is expired or used.');
        }

        // attach user to req
        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(400, error?.message || 'Invalid access token.');
    }

}

export {verifyJWT};