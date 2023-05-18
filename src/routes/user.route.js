import { Router } from "express";
import passport from "passport";
import { authController } from "../controllers/user.controller.js";
import upload from "../lib/multer.js";
import compression from "compression";

const router = Router();

router.route("/admin").get(authController.getAdmin);

router
  .route("/")
  .get(authController.getLogin)
  .post(
    passport.authenticate("login", { failureRedirect: "/fail-login" }),
    authController.getLogin
  );

router
  .route("/register")
  .get(authController.getRegister)
  .post(
    upload.single("photo"),
    passport.authenticate("register", { failureRedirect: "/fail-register" }),
    authController.getLoginMail
  );

router.get("/user", authController.getUser)

router.get("/fail-login", authController.getLoginFailiure);
router.get("/fail-register", authController.getRegisterFailiure);

router.get("/logout", authController.logOut);

router.get("/info", compression(), authController.getInfo);

export const userRouter = router;
