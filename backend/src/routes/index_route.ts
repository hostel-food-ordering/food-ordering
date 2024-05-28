import { Router } from "express";
import shopRoutes from "./shop";
import itemRoutes from "./item";
import userRoute from "./user";

const router = Router();

router.use(shopRoutes);
router.use(itemRoutes);
router.use(userRoute);

export default router;
