import mongoose, { Schema } from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
    },
    vaultId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vault',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    file: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }]
}, {timestamps: true});

export const Resource = mongoose.model('Resource', resourceSchema);