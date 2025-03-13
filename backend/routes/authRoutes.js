// router
import { Router } from "express";
export const router = Router()

// controller
import { UserController } from "../controllers/userController.js";

// routes
router.post("/register")