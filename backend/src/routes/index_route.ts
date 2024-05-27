import { Router } from "express";
import shopRoutes from "./shop";
import itemRoutes from "./item";

const router = Router();

router.use(shopRoutes);
router.use(itemRoutes);

export default router;
