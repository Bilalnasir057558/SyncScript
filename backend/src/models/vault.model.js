import mongoose, { Schema } from "mongoose";

const vaultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }, 
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

export const Vault = mongoose.model('Vault', vaultSchema);