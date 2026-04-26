import mongoose from "mongoose";

const annotationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resourceId: {
        type: mongoose.Types.ObjectId,
        ref: 'Resource',
        required: true
    }
}, {timestamps: true});

export const Annotation = mongoose.model('Annotation', annotationSchema);