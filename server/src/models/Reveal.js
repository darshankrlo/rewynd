import mongoose from "mongoose";

const revealSchema = new mongoose.Schema({
    capsuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Capsule',
        required: true,
        unique: true
    },
    experiencePlan: {
        type: Object,
        required: true
    },
    generationMetadata: {
        type: Object,
        default: () => ({})
    },
    version: {
        type: String,
        required: true,
        default: "1.0.0"
    }
}, { timestamps: true });

const Reveal = mongoose.model('Reveal', revealSchema);


export default Reveal;