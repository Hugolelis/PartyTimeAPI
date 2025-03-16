// router
import { Router } from "express";
export const router = Router()

// controller
import { partyController } from "../controllers/PartyController.js";

// define file sotrage
import multer from "multer";
import { diskStorage } from "../helpers/file-storage.js";
const upload = multer({ storage: diskStorage })

// middlewares
import { checkToken } from "../helpers/check-token.js";

// routes
router.post('/create', checkToken, upload.fields([{ name: "photos" }]),  partyController.createParty)
router.get('/parties', partyController.getParties)
router.get('/parties/user', checkToken, partyController.getAllUserParties)
router.get('/parties/userParty/:id', checkToken, partyController.getUserParty)