import Capsule from "../models/Capsule.js";
import CapsuleMember from "../models/CapsuleMember.js";
import { generateJoinCode } from "../utils/generateJoinCode.js";

export const createCapsule = async (req, res) => {
    const { name, unlockAt } = req.body;
    const joinCode = generateJoinCode();

    try {
        const capsule = await Capsule.create({
            creatorId: req.user.userId,
            name,
            unlockAt,
            joinCode
        });

        await CapsuleMember.create({
            capsuleId: capsule._id,
            userId: req.user.userId,
            role: "CREATOR"
        });

        res.status(201).json(capsule);

    } catch (error) {
    console.error("Create capsule error:", error);

    res.status(500).json({
        message: "Error creating capsule"
    });
}
    
};

export const joinCapsule = async (req, res) => {
    const { joinCode } = req.body;

    try {
        const capsule = await Capsule.findOne({ joinCode });

        if (!capsule) {
            return res.status(404).json({
                message: "Capsule not found"
            });
        }

        const existingMember = await CapsuleMember.findOne({
            capsuleId: capsule._id,
            userId: req.user.userId
        });

        if (existingMember) {
            return res.status(400).json({
                message: "User already a member of this capsule"
            });
        }

        await CapsuleMember.create({
            capsuleId: capsule._id,
            userId: req.user.userId,
            role: "MEMBER"
        });

        res.status(200).json({
            message: "Joined capsule successfully"
        });

    } catch (error) {
        console.error("Join capsule error:", error);

        res.status(500).json({
            message: "Error joining capsule"
        });
    }
};

export const confirmUnlock = async (req, res) => {
    const { capsuleId } = req.params;

    try {
        const member = await CapsuleMember.findOne({
            capsuleId,
            userId: req.user.userId
        });

        if (!member) {
            return res.status(403).json({
                message: "You are not a member of this capsule"
            });
        }

        member.unlockConfirmed = true;
        await member.save();

        res.status(200).json({
            message: "Unlock confirmed"
        });

    } catch (error) {
        console.error("Confirm unlock error:", error);

        res.status(500).json({
            message: "Error confirming unlock"
        });
    }
};