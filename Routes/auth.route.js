import express from "express";
import {
  infoUser,
  login,
  register,
  refreshToken,
  logout,
} from "../Controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResultExpress } from "../Middlewares/ValidationResultExpress.js";
import { requireToken } from "../Middlewares/requireAuth.js";
const router = express.Router();

router.post(
  "/register",
  [
    body("email", "Formato de email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
    body("password", "Formato de contraseña incorrecta").custom(
      (value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("No coinciden las contraseñas");
        }
        return value;
      }
    ),
  ],
  validationResultExpress,
  register
);
router.post(
  "/login",
  [
    body("email", "Formato de email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  ],
  login
);

router.get("/protected", requireToken, infoUser);
router.get("/refresh", refreshToken);
router.get("/logout", logout)

export default router;
