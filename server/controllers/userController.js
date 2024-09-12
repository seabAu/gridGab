import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import { swapIfValid } from "../utilities/apiUtils.js";
import bcrypt from "bcryptjs";

const debug = process.env.DEBUG || false;

const formatProfile = ( user, isLoggedUser = false ) => {
    if ( isLoggedUser ) {
        // If requesting user is logged in user, then send full details.
        return {
            _id: user._id,
            name: user.name,
            display_name: user.display_name,
            email: user.email,
            avatar: user.avatar,
            banner: user.banner,
            role: user.role,
            status: user.status,
            about: user.about,
            friends: user.friends,
            last_login: user.last_login,
            register_date: user.register_date,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: user.token,
        };
    }
    else {
        // Else, send only basic details for viewing purposes. 
        return {
            _id: user._id,
            name: user.name,
            display_name: user.display_name,
            email: user.email,
            avatar: user.avatar,
            banner: user.banner,
            role: user.role,
            status: user.status,
            about: user.about,
            // friends: user.friends,
            // last_login: user.last_login,
            register_date: user.register_date,
            createdAt: user.createdAt,
            // updatedAt: user.updatedAt,
            token: user.token,
        };
    }

}

const signupUser = asyncHandler( async ( req, res ) => {
    let { name, display_name, password, email, avatar } = req.body;

    if ( !name || !email || !password ) {
        // res.status( 400 );
        // throw new Error( "Please enter all the fields" );
        res.status( 400 ).send( {
            error: "Please enter all the fields.",
            success: false,
        } );
    }

    // Fill in any nonrequired fields if they're null or undefined. 
    if ( !display_name ) display_name = name;

    // Find user by email address.
    const userExists = await User.findOne( { email: email } );

    if ( userExists ) {
        // res.status( 400 );
        // throw new Error( "User already exists." );

        return res.status( 400 ).send( {
            error: "User already exists with that email. If you lost your login info, click 'Recover login'.",
            success: false,
        } );
    }

    if ( !display_name ) display_name = name;

    let user = await User.create( {
        name,
        display_name,
        email,
        password,
        avatar
    } );

    if ( user ) {
        const token = generateToken( user._id );
        user.token = token; 

        await user.save();

        return res.status( 201 ).send( {
            data: formatProfile( user, true ),

            // data: {
            //     _id: user._id,
            //     name: user.name,
            //     display_name: user.display_name,
            //     email: user.email,
            //     avatar: user.avatar,
            //     banner: user.banner,
            //     role: user.role,
            //     status: user.status,
            //     about: user.about,
            //     friends: user.friends,
            //     last_login: user.last_login,
            //     register_date: user.register_date,
            //     createdAt: user.createdAt,
            //     updatedAt: user.updatedAt,
            //     token: token,
            // },
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
    // const { email, password } = req.body; // Auth with email
    let { name, password } = req.body; // Auth with username

    try {
        // Find if user exists.
        // const user = await User.findOne( { email: email } ); // Auth with email
        let user = await User.findOne( { name: name } ); // Auth with username
        let passwordMatches = await user.matchPassword( password );
        if ( user && ( passwordMatches ) ) {
            // User exists and password matches.
            // Save the token to the user and update the last_login time. 
            const token = generateToken( user._id );
            user.last_login = new Date();
            user.token = token;
            user = await user.save();

            // Remove password and any other fields we do not want to be sent to the front end. 
            // let userData = { ...user };
            // delete userData.password;
            console.log( 'authUser :: user = ', user );

            return res.status( 201 ).send( {
                data: formatProfile( user, true ),
                // data: {
                //     _id: user._id,
                //     name: user.name,
                //     display_name: user.display_name,
                //     email: user.email,
                //     avatar: user.avatar,
                //     banner: user.banner,
                //     role: user.role,
                //     status: user.status,
                //     about: user.about,
                //     friends: user.friends,
                //     last_login: user.last_login,
                //     register_date: user.register_date,
                //     createdAt: user.createdAt,
                //     updatedAt: user.updatedAt,
                //     token: user.token,
                // },
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
    } catch ( error ) {
        console.log( "Error in authUser: ", error.message );
        return res
            .status( 500 )
            .json( { message: error.message } )
    }

} );

// /api/user?search=_______, fetch with req.query.
// Alternative to /api/user/:id, which is fetched with req.params
const searchUsers = asyncHandler( async ( req, res ) => {
    const query = req.query;
    console.log( "User search with term(s): ", req.query, " :: ", "token = ", req.headers.authorization.split( " " )[ 1 ] );

    let keyword;
    let users;
    if ( query.search === "*" ) {
        // Indicates a wildcard search. Return absolutely everyone. 

        users = await User
            .find( {
                _id: {
                    // $ne = not equals to
                    $ne: req.user._id
                }
            } )
            .select( "-password" )
            .select( "-updatedAt" )
            ;
    }
    else {
        // $options: "i" indicates case insensitivity. 
        keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { display_name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ]
        } : {};

        // Return all users that match the provided search term(s), EXCEPT the logged in user.
        // This requires the user ID to be sent along with the query request.
        users = await User
            .find( keyword )
            .find( {
                _id: {
                    // $ne = not equals to
                    $ne: req.user._id
                }
            } )
            .select( "-password" )
            .select( "-updatedAt" )
            ;
    }

    return res.send( {
        data: users,
        message: "",
        success: users.length > 0 ? true : false,
    } );

} );

// /api/user/profile
// Updated details in req.body
// Update profile details. 
/*  // User data fields: 
name
display_name
password
email
avatar
role
friends
status
about
token
register_date
last_login
settings
*/
const updateProfile = asyncHandler( async ( req, res ) => {
    let userUpdate = req.body;
    let userId = req.user._id;
    // console.log( req.body, req.user );

    try {
        let user = await User.findById( userId );
        console.log( "updateProfile -> user = ", user, "\n\n\n", "userUpdate = ", userUpdate );
        if ( !user ) {
            return res.status( 404 ).json( { message: "User not found" } );
        }

        // if ( req.params.id !== userId.toString() ) {
        //     return res.status( 401 ).json( { error: "You cannot update other user's profile" } );
        // }

        if ( userUpdate.password && userUpdate.password !== "" ) {
            const passwordMatches = await user.matchPassword( userUpdate.password );
            console.log( "updateProfile :: password given: ", userUpdate.password, " :: ", "passwordMatches = ", passwordMatches );
            // // Salt the password.
            // const salt = await bcrypt.genSalt( 10 );
            // const hashedPassword = await bcrypt.hash( password, salt );
            // userUpdate.password = hashedPassword;
        }

        /*  if ( userUpdate.avatar ) {
                if ( user.avatar ) {
                    await cloudinary
                        .uploader
                        .destroy( user.avatar.split( "/" ).pop().split( "." )[ 0 ] );
                }

                const uploadedResponse = await cloudinary
                    .uploader
                    .upload( avatar );

                userUpdate.avatar = uploadedResponse.secure_url;
            }
        */

        // Update values if present in req.body;
        user.name = swapIfValid( user.name, userUpdate.name );
        user.display_name = swapIfValid( user.display_name, userUpdate.display_name );
        user.email = swapIfValid( user.email, userUpdate.email );
        user.avatar = swapIfValid( user.avatar, userUpdate.avatar );
        user.banner = swapIfValid( user.banner, userUpdate.banner );
        user.status = swapIfValid( user.status, userUpdate.status );
        user.about = swapIfValid( user.about, userUpdate.about );
        // user.friends = swapIfValid( user.friends, userUpdate.friends );
        // user.isFrozen = swapIfValid( user.isFrozen, userUpdate.isFrozen );
        // user.isVisible = swapIfValid( user.isVisible, userUpdate.isVisible );
        // user.isPrivate = swapIfValid( user.isPrivate, userUpdate.isPrivate );
        // user.isVerified = swapIfValid( user.isVerified, userUpdate.isVerified );
        // user.settings = swapIfValid( user.settings, userUpdate.settings );
        // user.id = userUpdate.userId;

        // // console.log( "Updated user = ", user );
        // const merged = mergeProps( user, userUpdate );

        console.log( "UpdateProfile :: ", "user ", user );
        const token = generateToken( user._id );
        user.token = token;

        user = await user.save();
        delete user.password;

        return res
            .status( 200 )
            .json( {
                message: "Profile updated successfully.",
                user: user
            } );
    } catch ( error ) {
        console.log( "Error in updateProfile: ", error.message );
        return res
            .status( 500 )
            .json( { message: error.message } )
    }
} )

// /api/user/:id
// Get Profile
const getProfile = asyncHandler( async ( req, res ) => {
    // const reqUserData = req.user;
    const reqUserId = req.user._id;
    const { id } = req.params;
    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        // Not a valid ID given. 
        return res
            .status( 400 )
            .json( {
                error: "Invalid ID given"
            } );
    }
    try {
        let userData = await User
            .findOne( {
                _id: id
            } )
            .select( '-password' )
            // .select( '-updatedAt' )
            ;
        if ( !userData ) {
            // Not found. 
            return res
                .status( 404 )
                .json( {
                    message: "User not found"
                } );
        }
        else {
            // let userData = { ...userData };
            // Found user. Return their profile.
            if ( req.user._id === userData._id ) {
                // If requesting user is :id, then send full details.
                const token = generateToken( userData._id );
                userData.token = token;
                console.log( "GetProfile :: userData = ", userData );
            }
            else {
                // Else, send only basic details for viewing purposes. 
                delete userData.friends;
                delete userData.token;
                delete userData.last_login;
            }

            const token = generateToken( userData._id );

            return res
                .status( 200 )
                .json( {
                    data: formatProfile( userData, true ),
                    // data: {
                    //     _id: userData._id,
                    //     name: userData.name,
                    //     display_name: userData.display_name,
                    //     email: userData.email,
                    //     avatar: userData.avatar,
                    //     banner: userData.banner,
                    //     role: userData.role,
                    //     status: userData.status,
                    //     about: userData.about,
                    //     friends: userData.friends,
                    //     last_login: userData.last_login,
                    //     register_date: userData.register_date,
                    //     createdAt: userData.createdAt,
                    //     updatedAt: userData.updatedAt,
                    //     token: token,
                    // },
                    message: "Fetched profile successfully.",
                    success: true
                } );
        }

    } catch ( error ) {
        console.log( "Error in getProfile: ", error.message );
        return res
            .status( 500 )
            .json( {
                message: error.message
            } );
    }


} );

// /api/user/:id/add
// Add friend
const addFriend = asyncHandler( async ( req, res ) => {
    const userId = req.user._id;
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        // Not a valid ID given. 
        return res
            .status( 400 )
            .json( {
                message: "Invalid ID given"
            } );
    }

    try {
        // const user = await User.findById( userId ).select( '-password' );
        const addUser = await User.findById( id ).select( '-password' );
        console.log( "addFriend", " :: ", "addUser = ", addUser );
        if ( !addUser ) {
            // User to befriend not found. 
            return res
                .status( 404 )
                .json( {
                    message: "User not found"
                } );
        }

        if ( req.user.friends.includes( addUser._id ) ) {
            // Already friends. 
            console.log( "addFriend :: Already friends. req.user.friends = ", req.user.friends, " :: ", "addUser._id = ", addUser._id );
            return res
                .status( 422 )
                .json( {
                    message: "You are already friends!"
                } );
        }
        else {
            // Not friends yet.
            // Update requesting user's data.
            let updatedUser = await User.findByIdAndUpdate( req.user._id, {
                $push: {
                    friends: addUser._id
                }
            } )
                .select( "-password" )
                ;

            // Update befriended user's data. May not want to keep this part? 
            // Could instead have any mismatches between befriender and befriended as an instance to display a "Allow this user to add you?" prompt. 
            let updatedAddUser = await User.findByIdAndUpdate( addUser._id, {
                $push: {
                    friends: req.user._id
                }
            } )
                .select( "-password" )
                ;

            const token = generateToken( updatedUser._id );
            updatedUser.token = token;
            console.log( "addFriend :: updatedUser = ", updatedUser );

            return res
                .status( 200 )
                .json( {
                    data: updatedUser,
                    message: "User added successfully.",
                    success: true
                } );
        }
    } catch ( error ) {
        console.log( "Error in addFriend: ", error.message );
        return res
            .status( 500 )
            .json( {
                message: error.message
            } );
    }
} );

// /api/user/:id/remove
// Remove friend
const removeFriend = asyncHandler( async ( req, res ) => {
    const userId = req.user._id;
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        // Not a valid ID given. 
        return res
            .status( 400 )
            .json( {
                message: "Invalid ID given"
            } );
    }

    try {
        // const user = await User.findById( userId ).select( '-password' );
        const addUser = await User.findById( id ).select( '-password' );

        if ( !addUser ) {
            // User to befriend not found. 
            return res
                .status( 404 )
                .json( {
                    message: "User not found"
                } );
        }

        if ( req.user.friends.includes( addUser._id ) ) {
            // Am friends, can remove.
            // Update requesting user's data.
            console.log( "removeFriend :: Already friends. req.user.friends = ", req.user.friends, " :: ", "addUser._id = ", addUser._id );
            let updatedUser = await User.findByIdAndUpdate( req.user._id, {
                $pull: {
                    friends: addUser._id
                }
            } )
                .select( "-password" )
                ;

            let updatedAddUser = await User.findByIdAndUpdate( addUser._id, {
                $pull: {
                    friends: req.user._id
                }
            } )
                .select( "-password" )
                ;

            const token = generateToken( updatedUser._id );
            updatedUser.token = token;
            console.log( "removeFriend :: updatedUser = ", updatedUser );

            return res
                .status( 200 )
                .json( {
                    data: updatedUser,
                    message: "User removed successfully.",
                    success: true
                } );
        }
        else {
            // Not friends, can't remove, exit. 
            return res
                .status( 422 )
                .json( {
                    message: "You are not friends with this user, cannot remove. "
                } );
        }
    } catch ( error ) {
        console.log( "Error in removeFriend: ", error.message );
        return res
            .status( 500 )
            .json( {
                message: error.message
            } );
    }
} );

export {
    signupUser,
    authUser,
    searchUsers,
    updateProfile,
    getProfile,
    addFriend,
    removeFriend,
}