import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middleware/authMw";

const router = Router();

router.get("/protected", requireAuth, (req: AuthedRequest, res) => {
  res.json({
    userId: req.user?.sub,
  });
});

export default router;
