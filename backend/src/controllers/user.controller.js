import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

export {
    registerUser
}
