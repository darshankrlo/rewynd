import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

reflectionSchema.index({ capsuleId: 1, userId: 1 }, { unique: true });

const Reflection = mongoose.model('Reflection', reflectionSchema);

export default Reflection;