import { Router } from "express";
import { authController } from "../controllers/user.controller.js";

const router = Router();

router.route("/chat").get(authController.globalChat);

router.route("/chat/:email").get(authController.findChatByMail);

export const chatRouter = router;
