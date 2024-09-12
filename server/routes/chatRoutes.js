import express from 'express';
import * as C from "../controllers/chatController.js";
import protectedRoute from "../middleware/authMiddleware.js";
const router = express.Router();

// Root: /api/chat
// POST 
// Endpoint: /api/chat/
router.route( '/' ).post( protectedRoute, C.accessChat );

// 
// GET 
// Endpoint: /api/chat/
router.route( '/' ).get( protectedRoute, C.fetchChats );

// 
// GET 
// Endpoint: /api/chat/rooms
router.route( '/rooms' ).get( protectedRoute, C.fetchPublicChats );

// 
// PUT 
// Endpoint: /api/chat/update
router.route( '/update' ).put( protectedRoute, C.updateChat );

// 
// POST 
// Endpoint: /api/chat/group
router.route( '/new' ).post( protectedRoute, C.createGroupChat );

// 
// PUT 
// Endpoint: /api/chat/group/rename
router.route( '/rename' ).put( protectedRoute, C.renameGroup );

// 
// PUT 
// Endpoint: /api/chat/group/add
router.route( '/add' ).put( protectedRoute, C.addToGroup );

// 
// PUT 
// Endpoint: /api/chat/group/remove
router.route( '/remove' ).put( protectedRoute, C.removeFromGroup );




export default router;