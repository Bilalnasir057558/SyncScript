import mongoose, { Schema } from "mongoose";

const invitationSchema = new mongoose.Schema({
    vaultId: {
        type: Schema.Types.ObjectId,
        ref: 'Vault',
        required: true
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invitedEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['Owner', 'Contributor', 'Viewer'],
        default: 'Viewer'
    },
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Invitation = mongoose.model('Invitation', invitationSchema);