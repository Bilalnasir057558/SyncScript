import mongoose, { modelNames } from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    resourceId: {
        type: mongoose.Types.ObjectId,
        ref: 'Resource',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

export const File = mongoose.model('File', fileSchema);