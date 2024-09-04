import express from 'express';
import * as C from "../controllers/chatController.js";
import protectedRoute from "../middleware/authMiddleware.js";
const router = express.Router();

// 
router.route( '/' ).post( protectedRoute, C.accessChat );

// 
router.route( '/' ).get( protectedRoute, C.fetchChats );

// 
router.route( '/group' ).post( protectedRoute, C.createGroupChat );

// 
router.route( '/group/rename' ).put( protectedRoute, C.renameGroup );

// 
router.route( '/group/remove' ).put( protectedRoute, C.removeFromGroup );

// 
router.route( '/group/add' ).put( protectedRoute, C.addToGroup );




export default router;