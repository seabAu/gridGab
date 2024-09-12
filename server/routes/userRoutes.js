import express from 'express';
import * as C from "../controllers/userController.js";
import protectedRoute from "../middleware/authMiddleware.js";
const router = express.Router();

// Root: /api/user
router.post( '/login', C.authUser ); 

// router.post( '/signup', C.signupUser ); 
router.route( '/' )
    .post( C.signupUser )  // If post, signup user.
    .get( protectedRoute, C.searchUsers ); // If get, search users.

router.post( '/profile', protectedRoute, C.updateProfile );

router.get( '/:id', protectedRoute, C.getProfile );

router.post( '/:id/add', protectedRoute, C.addFriend );

router.post( '/:id/remove', protectedRoute, C.removeFriend );

export default router;