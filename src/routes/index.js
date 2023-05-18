import { Router } from "express";

import { userRouter } from "./user.route.js";
import { cartRouter } from "./cart.route.js";
import { productRouter } from "./product.route.js";
import { chatRouter } from "./chat.route.js";

const router = Router();

router.use(userRouter);
router.use(cartRouter);
router.use(productRouter);
router.use(chatRouter);

export default router;
