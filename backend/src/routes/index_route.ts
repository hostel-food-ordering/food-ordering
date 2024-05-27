import { Router } from "express";
import shopRoutes from "./shop";

const router = Router();

router.use(shopRoutes);

export default router;
