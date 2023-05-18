import { Router } from "express";
import passport from "passport";
import { authController } from "../controllers/user.controller.js";
import upload from "../lib/multer.js";
import compression from "compression";

const router = Router();

// ruta para administradores, con el form de productos y el chat. Cambiar a true prop admin del user
router.route("/admin").get(authController.getAdmin);

// ruta de login
router
  .route("/")
  .get(authController.getLogin)
  .post(
    passport.authenticate("login", { failureRedirect: "/fail-login" }),
    authController.getLogin
  );

// ruta de register
router
  .route("/register")
  .get(authController.getRegister)
  .post(
    upload.single("photo"),
    passport.authenticate("register", { failureRedirect: "/fail-register" }),
    authController.getLoginMail
  );

router.get("/user", authController.getUser)

//fails
router.get("/fail-login", authController.getLoginFailiure);
router.get("/fail-register", authController.getRegisterFailiure);

// ruta de logout
router.get("/logout", authController.logOut);

//ruta info
router.get("/info", compression(), authController.getInfo);

export const userRouter = router;
