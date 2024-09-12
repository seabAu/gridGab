import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectedRoute = asyncHandler( async ( req, res, next ) => {
    let token;
    if ( 
        req.headers.authorization &&
        req.headers.authorization.startsWith( "Bearer" )
    ) {
        token = req.headers.authorization.split( " " )[ 1 ];
        // console.log( "protectedRoute :: ", "token = ", token );
        if ( !token ) {
            // throw new Error( "Failed to authorize user for protected route: No token" );
            return res.status( 401 ).send( {
                message: "Failed to authorize user for protected route: No token",
                success: false,
            } );
        }
        try {
            // Decode token.
            const decoded = jwt.verify( token, process.env.JWT_SECRET );
            // console.log( "protectedRoute :: decoded = ", decoded, " :: ", "token = ", token );

            // Extracts token id.
            req.user = await User
                .findById( decoded.id )
                // .findOne( { _id: decoded } )
                .select( "-password" );
            // console.log( "protectedRoute :: req.user found = ", req.user );

            // Proceed now that we have the id loaded into the user object of the original request.
            // res.status = 200;
            next();
        } catch ( error ) {
            // throw new Error( `Failed to authorize user for protected route: ${ error }` );
            // console.log( "protectedRoute :: error = ", error );
            return res.status( 402 ).send( {
                message: `Failed to authorize user for protected route: ${ error }`,
                success: false,
            } );
        }
    }

} );


export default protectedRoute;