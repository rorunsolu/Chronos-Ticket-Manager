import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { requireAuth } from "../middleware/authMw";

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.patch("/", requireAuth, updateProfile);

export default router;
