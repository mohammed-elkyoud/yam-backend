import express from "express";
import { signup, login } from "../controllers/authController.js";
import {authenticateToken} from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

export default router;
