import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
    
        if(!user) {
            throw new ApiError(500, 'Something went wrong while creating tokens.');
        }
    
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
 
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // bypass validation b/c only refresh token is changed
    
        return {
            accessToken, 
            refreshToken
        };
    } catch (error) {
        throw new  ApiError(500, 'Something went wrong while generating tokens.');
    }
}

const registerUser = asyncHandler(async (req, res) => {
  // get data from the user
  const { username, fullName, email, password } = req.body;

  // validate
  if (
    [username, fullName, email, password].some(
      (field) => !field || (typeof field === "string" && !field.trim()),
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // check duplicate user
  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    throw new ApiError(409, "User already exists.");
  }

  // if not exist -> create user in db
  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
  });

  // check user created or not
  const confirmUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!confirmUser) {
    throw new ApiError(500, "Something went wrong while registration.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, confirmUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {

    // get details from the user
    const {email, password} = req.body;

    // validate
    if([email, password].some(field => 
        !field || (typeof field === "string" && !field.trim()))) {
            throw new ApiError(400, 'All fields are required.');
    }

    // find user in db
    const user = await User.findOne({
        email
    });

    if(!user) {
        throw new ApiError(400, 'Email does not exist.');
    }

    // if email matches => match the password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(400, 'Password is wrong.');
    }

    // generate tokens
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    // extract user without password and refresh token to show in res
    const validUser = await User.findById(user._id).select("-password -refreshToken"); 

    if(!validUser) {
        throw new ApiError(500, 'Something went wrong while signing in.');
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    // return tokens in cookies
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: validUser, accessToken, refreshToken
            },
            'User logged in successfully.'
        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    
    // logged in user can logout -> access to req.user
    await User.findByIdAndUpdate(
        req.user?._id,
        {
           $set: { refreshToken: undefined }
        },
        {
            returnDocument: "after"
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(200, {}, 'User logged out successfully.')
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    if(!req.cookies?.refreshToken) {
        throw new ApiError(400, 'Unauthorized access.');
    }

    // get refresh token from cookies or header
    const oldRefreshToken = req.cookies?.refreshToken || req.header('Authorization').replace('Bearer ', '');

    if(!oldRefreshToken) {
        throw new ApiError(400, 'Unauthorized request.');
    }

    // verify token
    const decode = await jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    if(!decode){
        throw new ApiError(400, 'Invalid refresh token.');
    }

    // find user in the db
    const user = await User.findById(decode._id).select("-password");

    if(!user) {
        throw new ApiError(400, 'Refresh token is expired or used.');
    }

    // match refresh token
    if(oldRefreshToken !== user.refreshToken) {
        throw new ApiError(400, 'Invalid refresh token.');
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    console.log(oldRefreshToken);
    console.log(accessToken)
    console.log(refreshToken);

    // replace old token with new token
    user.refreshToken = refreshToken;
    user.save( {validateBeforeSave: false} );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: user, accessToken, refreshToken
            },
            'Access token refreshed successfully.'
        )
    )
})

const getCurrentUser = asyncHandler(async (req, res) => {

    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, 'User fetched successfully.')
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
}
