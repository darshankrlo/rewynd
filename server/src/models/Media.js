import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    capsuleId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Capsule',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['IMAGE', 'VIDEO'],
        required: true
    },
    storageKey: {
        type: String,
        required: true
    },
    metadata: {
        type: Object,
        default: () => ({})
    }
}, { timestamps: true });

mediaSchema.index({ capsuleId: 1 });

const Media = mongoose.model('Media', mediaSchema);

export default Media;