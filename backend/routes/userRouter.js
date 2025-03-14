// router
import { Router } from "express";
export const router = Router()

// controller
import { UserController } from "../controllers/userController.js";

// middlewares
import { checkToken } from "../helpers/check-token.js";

// routes
router.get('/:id', checkToken, UserController.getUser)
router.put('/update/:id', checkToken, UserController.updateUser)