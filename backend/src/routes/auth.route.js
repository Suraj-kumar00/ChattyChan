import express from "express";
import { login, logout, singup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/singup", singup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
