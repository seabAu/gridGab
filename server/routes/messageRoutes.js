import express from 'express';
import * as C from "../controllers/messageController.js";
import protectedRoute from "../middleware/authMiddleware.js";
const router = express.Router();

router.route( '/' ).post( protectedRoute, C.sendMessage );

router.route( '/:chatId' ).get( protectedRoute, C.getMessages );

export default router;