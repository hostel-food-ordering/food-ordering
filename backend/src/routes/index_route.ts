import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import shopRoutes from "./shop";
import itemRoutes from "./item";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/shop", shopRoutes);
router.use("/item", itemRoutes);

export default router;
