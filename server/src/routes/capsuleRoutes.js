import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createCapsule , joinCapsule , confirmUnlock} from "../controllers/capsuleController.js";
import { createReflection } from "../controllers/reflectionController.js";
import { createMedia } from "../controllers/mediaController.js";

const router = express.Router();

router.post("/", authMiddleware, createCapsule);
router.post("/join", authMiddleware, joinCapsule);
router.post("/:capsuleId/reflection", authMiddleware, createReflection);
router.post("/:capsuleId/media", authMiddleware, createMedia);
router.post("/:capsuleId/unlock", authMiddleware, confirmUnlock);

export default router;