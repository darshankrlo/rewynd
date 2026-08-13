import mongoose from "mongoose";

const capsuleSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true  
    },
    joinCode: {
        type: String,
        required: true,
        unique: true
    },
    unlockAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: [
            "COLLECTING",
            "LOCKED",
            "PROCESSING",
            "READY",
            "UNLOCKING",
            "REVEALED"
        ],
        default: "COLLECTING"
    }
}, { timestamps: true });

const Capsule = mongoose.model('Capsule', capsuleSchema);

export default Capsule;