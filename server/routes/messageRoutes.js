import express from 'express';
import * as C from "../controllers/messageController.js";
import protectedRoute from "../middleware/authMiddleware.js";
const router = express.Router();

// Send a message.
router.route( '/' ).post( protectedRoute, C.sendMessage );

// Get messages for a chat. 
router.route( '/:chatId' ).get( protectedRoute, C.getMessages );

// Delete a message.
router.route( '/:messageId' ).delete( protectedRoute, C.deleteMessage );

export default router;