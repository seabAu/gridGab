import express from 'express';
import * as C from "../controllers/userController.js";
import protectedRoute from "../middleware/authMiddleware.js";
const router = express.Router();

router.post( '/login', C.authUser ); 

// router.post( '/signup', C.signupUser ); 
router.route( '/' )
    .post( C.signupUser )  // If post, signup user.
    .get( protectedRoute, C.searchUsers ); // If get, search users.

export default router;