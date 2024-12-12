import express from "express";
import { login, logout, singup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/singup");

router.post("/login");

router.post("/logout");

export default router;
