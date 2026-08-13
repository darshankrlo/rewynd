import Reflection from "../models/Reflection.js";

export const createReflection = async (req, res) => {
    const { content } = req.body;
    const { capsuleId } = req.params;

    try {
        const reflection = await Reflection.create({
            capsuleId,
            userId: req.user.userId,
            content
        });

        res.status(201).json({
            message: "Reflection created successfully",
            reflection
        });

    } catch (error) {
        console.error("Create reflection error:", error);

        res.status(500).json({
            message: "Error creating reflection"
        });
    }
};