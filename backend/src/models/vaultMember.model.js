import mongoose, { Schema } from "mongoose";

const VaultMemberSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    vaultId: {
        type: Schema.Types.ObjectId, 
        ref: 'Vault'
    },
    role: {
        type: String,
        enum: ['Owner', 'Contributor', 'Viewer']
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

export const VaultMember = mongoose.model('VaultMember', VaultMemberSchema);