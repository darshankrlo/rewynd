import Media from "../models/Media.js";

export const createMedia = async (req, res) => {
    const { capsuleId } = req.params;
    const { type, storageKey, metadata } = req.body;

    try {
        const media = await Media.create({
            capsuleId,
            userId: req.user.userId,
            type,
            storageKey,
            metadata
        });

        res.status(201).json({
            message: "Media added successfully",
            media
        });

    } catch (error) {
        console.error("Create media error:", error);

        res.status(500).json({
            message: "Error adding media"
        });
    }
};