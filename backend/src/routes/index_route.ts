import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import shopRoutes from "./shop";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/shop", shopRoutes);

export default router;
