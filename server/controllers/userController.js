import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

const signupUser = asyncHandler( async (req, res) => {
    const { name, password, email, avatar } = req.body;
    let display_name = name;

    if ( !name || !email || !password ) {
        // res.status( 400 );
        // throw new Error( "Please enter all the fields" );
        res.status( 400 ).send( {
            error: "Please enter all the fields.",
            success: false,
        } );
    }

    // Find user by email address.
    const userExists = await User.findOne( { email: email } );

    if ( userExists ) {
        // res.status( 400 );
        // throw new Error( "User already exists." );
        
        return res.status( 400 ).send( {
            error: "User already exists.",
            success: false,
        } );
    }

    if ( !display_name ) display_name = name; 

    const user = await User.create( {
        name, 
        display_name,
        email,
        password,
        avatar
    } );

    if ( user ) {
        const token = generateToken( user._id );

        return res.status( 201 ).send( {
            data: {
                _id: user._id,
                name: user.name,
                display_name: user.display_name,
                email: user.email,
                avatar: user.avatar,
                register_date: user.register_date,
                token: token,
            },
            message: "Signed up successfully.",
            success: true,
        } );
    }
    else {
        // res.status( 400 );
        // throw new Error( "Failed to create new user." );
        return res.status( 400 ).send( {
            message: "Failed to create new user.",
            success: false,
        } );
    }
} );


// User login
const authUser = asyncHandler( async ( req, res ) => {
    const { email, password } = req.body;

    // Find if user exists.
    const user = await User.findOne( { email: email } );
    const passwordMatches = await user.matchPassword( password );
    if ( user && ( passwordMatches ) ) {
        // User exists and password matches.
        const token = generateToken( user._id );
        return res.status( 201 ).send( {
            data: {
                _id: user._id,
                name: user.name,
                display_name: user.display_name,
                email: user.email,
                avatar: user.avatar,
                register_date: user.register_date,
                token: token,
            },
            message: "Logged in successfully.",
            success: true,
        } );
    }
    else {
        // Some error.
        return res.status( 401 ).send( {
            message: "Failed to sign in.",
            success: false,
        } );
    }
} );

// /api/user?search=_______, fetch with req.query.
// Alternative to /api/user/:id, which is fetched with req.params
const searchUsers = asyncHandler( async ( req, res ) => {
    const query = req.query; 
    console.log( "User search with term(s): ", req.query );

    const search = query.search;

    // $options: "i" indicates case sensitivity. 
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    // Return all users that match the provided search term(s), EXCEPT the logged in user.
    // This requires the user ID to be sent along with the query request.
    const users = await User
        .find( keyword )
        .find( {
            _id: {
                // $ne = not equals to
                $ne: req.user._id
            }
        } );

    return res.send( {
        data: users,
        message: "",
        success: users.length > 0 ? true : false,
    } );

} );


export {
    signupUser,
    authUser,
    searchUsers,
}