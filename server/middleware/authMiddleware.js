import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectedRoute = asyncHandler( async ( req, res, next ) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith( "Bearer" )
    ) {
        try {
            // Decode token.
            token = req.headers.authorization.split( " " )[ 1 ];
            const decoded = jwt.verify( token, process.env.JWT_SECRET );
            // console.log( "protectedRoute :: decoded = ", decoded );

            // Extracts token id.
            req.user = await User
                .findById( decoded.id )
                // .findOne( { _id: decoded } )
                .select( "-password" );
            // console.log( "protectedRoute :: req.user found = ", req.user );

            // Proceed now that we have the id loaded into the user object of the original request. 
            next();
        } catch (error) {
            res.status( 401 ).send( {
                message: `Failed to authorize user for protected route: ${ error }`,
                success: false,
            } );
            throw new Error( `Failed to authorize user for protected route: ${ error }` );
        }
    }

    if ( !token ) {
        res.status( 401 ).send( {
            message: "Failed to authorize user for protected route: No token",
            success: false,
        } );
        throw new Error( "Failed to authorize user for protected route: No token" );
    }
} );


export default protectedRoute;