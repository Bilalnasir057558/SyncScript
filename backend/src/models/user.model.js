import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        index: true
    },
    fullName: {
        type: String, 
        required: true,

    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true});

// before saving db object, encrypt the password
userSchema.pre('save', async function() {
    if(!this.isModified('password')) return; // returns if password is not changed
    this.password = await bcrypt.hash(this.password, 10);
})

// Schema methods => attached to each document
userSchema.methods.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model('User', userSchema);