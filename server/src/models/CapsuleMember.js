import mongoose from "mongoose";

const capsuleMemberSchema = new mongoose.Schema({
    capsuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Capsule',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['MEMBER', 'CREATOR'],
        default: 'MEMBER',
        required: true
    },
    unlockConfirmed: {
        type: Boolean,
        default: false
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

capsuleMemberSchema.index({ capsuleId: 1, userId: 1 }, { unique: true });

const CapsuleMember = mongoose.model('CapsuleMember', capsuleMemberSchema);

export default CapsuleMember;