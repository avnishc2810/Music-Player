import { Router } from "express";
import { getStats } from "../controller/stats.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/",protectRoute ,getStats)

export default router;