import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import generateToken from "../config/generateToken.js";

const debug = process.env.DEBUG || false;

const accessChat = asyncHandler( async ( req, res ) => {
    const { userId } = req.body; // Who we are trying to chat with.

    // Check if chat with user id exists; if so, return it.
    if ( !userId ) {
        console.log( "UserId param not sent with request." );

        return res.status( 400 ).send( {
            message: "UserId param not sent with request.",
            success: false,
        } );
    }

    let isChat = await Chat.find( {
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    } )
        .populate( "users", "-password" )
        .populate( "latestMessage" );

    // For latestMessages, we need the sender field. 
    isChat = await User.populate( isChat, {
        path: 'latestMessage.sender',
        select: "name avatar email",
    } );

    if ( isChat.length > 0 ) {
        // We have a chat to send. 

        return res.send( {
            data: isChat[ 0 ],
            message: "Chat accessed successfully.",
            success: true,
        } );
    }
    else {
        // No chat exists, create it. 
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [
                req.user._id,
                userId
            ]
        };

        try {
            const createdChat = await Chat.create( chatData );
            const createdChatData = await Chat
                .findOne(
                    { _id: createdChat._id }
                )
                .populate(
                    "users", "-password"
                );

            return res.status( 200 ).send( {
                data: createdChatData,
                message: "Chat created successfully.",
                success: true,
            } );
        } catch ( error ) {
            return res.status( 400 ).send( {
                message: error.message,
                success: false,
            } );
        }
    }
} );


const createGroupChat = asyncHandler( async ( req, res ) => {
    let { chatName, isPublicChat, chatIcon, chatStatus } = req.body;

    // if ( !req.body.users || !req.body.chatName ) {
    if ( !req.body.users ) {
        return res.status( 400 ).send( {
            message: "Please fill in all the fields."
        } );
    }

    // Users array are sent in the body.
    let users = JSON.parse( req.body.users );
    if ( users.length < 2 ) {
        // return res.status( 400 ).send( {
        //     message: "More than 2 users are required to form a group chat."
        // } );
    }

    // Push current user onto the array of users in this chat. 
    users.push( req.user );

    try {
        let chatName = req.body.chatName;
        if ( !chatName ) {
            // chatName = `Group chat with ${ users.length } people`;
            chatName = ""; // Blank, will be filled in dynamically with the user list. 
        }

        // Create the new chat. 
        const groupChat = await Chat.create( {
            chatName: chatName,
            isPublicChat: isPublicChat,
            users: users,
            // isGroupChat: true,
            isGroupChat: ( users.length > 2 ),
            groupAdmin: req.user,
            chatIcon: chatIcon,
            chatStatus: chatStatus,
        } );

        // Populate a version of it with subdata to send back to user. 
        const createdGroupChatData = await Chat
            .findOne(
                { _id: groupChat._id }
            )
            .populate( "users", "-password" )
            .populate( "groupAdmin", "-password" );

        return res.status( 200 ).send( {
            data: createdGroupChatData,
            message: "New chat created!"
        } );

    } catch ( error ) {
        return res.status( 400 ).send( {
            message: error.message,
            success: false,
        } );
    }
} );


/*
const createGroupChat = asyncHandler( async ( req, res ) => {
    // if ( !req.body.users || !req.body.chatName ) {
    if ( !req.body.users ) {
        return res.status( 400 ).send( {
            message: "Please fill in all the fields."
        } );
    }

    // Users array are sent in the body.
    let users = JSON.parse( req.body.users );
    if ( users.length < 2 ) {
        return res.status( 400 ).send( {
            message: "More than 2 users are required to form a group chat."
        } );
    }

    // Push current user onto the array of users in this chat. 
    users.push( req.user );

    try {
        let chatName = req.body.chatName;
        if ( !chatName ) {
            // chatName = `Group chat with ${ users.length } people`;
            chatName = ""; // Blank, will be filled in dynamically with the user list. 
        }

        const groupChat = await Chat.create( {
            chatName: req.body.chatName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        } );

        const createdGroupChatData = await Chat
            .findOne(
                { _id: groupChat._id }
            )
            .populate( "users", "-password" )
            .populate( "groupAdmin", "-password" );

        return res.status( 200 ).send( {
            data: createdGroupChatData,
            message: "New chat created!"
        } );

    } catch ( error ) {
        return res.status( 400 ).send( {
            message: error.message,
            success: false,
        } );
    }
} );
*/


const renameGroup = asyncHandler( async ( req, res ) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true
        }
    )
        .populate( "users", "-password" )
        .populate( "groupAdmin", "-password" );
    if ( !updatedChat ) {
        res.status( 404 ).send( "Error: Chat not found." );
        throw new Error( "Error: Chat not found" );
    }
    else {
        // res.json( updatedChat );
        return res.status( 200 ).send( {
            data: updatedChat,
            message: "Successfully renamed chat."
        } );
    }
} );

const addToGroup = asyncHandler( async ( req, res ) => {
    const { chatId, userId } = req.body;
    let chatData = await Chat.findById( chatId );
    let groupChat = ( chatData.users.length > 2 );
    let chat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
            $set: { isGroupChat: groupChat }
        },
        {
            new: true
        }
    )
        .populate( "users", "-password" )
        .populate( "groupAdmin", "-password" );

    if ( !chat ) {
        res.status( 404 ).send( "Error: Chat not found." );
        throw new Error( "Error: Chat not found" );
    }
    else {
        // res.json( chat );
        return res.status( 200 ).send( {
            data: chat,
            message: "Successfully added user to chat."
        } );

    }

} );

const removeFromGroup = asyncHandler( async ( req, res ) => {
    const { chatId, userId } = req.body;
    let chatData = await Chat.findById( chatId );
    let groupChat = ( chatData.users.length > 2 );
    let chat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
            $set: { isGroupChat: groupChat }
        },
        {
            new: true
        }
    )
        .populate( "users", "-password" )
        .populate( "groupAdmin", "-password" );

    if ( !chat ) {
        res.status( 404 ).send( "Error: Chat not found." );
        throw new Error( "Error: Chat not found" );
    }
    else {
        // res.json( chat );
        return res.status( 200 ).send( {
            data: chat,
            message: "Successfully removed user from chat."
        } );

    }

} );


const updateChat = asyncHandler( async ( req, res ) => {
    // Change chat details. 
    let { chatId, value, value_id } = req.body;
    try {
        // Find all chats in database that the logged in user is a part of.
        let chat = await Chat.findById( chatId );
        if ( value_id in chat ) {
            // Is a valid key in the schema.
            chat[ value_id ] = value;
        }

        console.log( "updateChat", "value = ", value, " :: ", "value_id = ", value_id, " :: ", "chat = ", chat );

        chat = await chat.save();

        return res.status( 200 ).send( {
            data: chat,
            message: "Chat updated successfully.",
            success: true,
        } );
    } catch ( error ) {
        return res.status( 400 ).send( {
            message: error.message,
            success: false,
        } );
    }
} );



const fetchChats = asyncHandler( async ( req, res ) => {
    try {
        // Find all chats in database that the logged in user is a part of.
        let chats = await Chat.find( {
            users: {
                $elemMatch: {
                    $eq: req.user._id
                }
            }
        } )
            .populate( "users", "-password" )
            .populate( "groupAdmin", "-password" )
            .populate( "latestMessage" )
            .sort( { updatedAt: -1 } );

        // console.log( "fetchChats :: chats fetched: ", chats );

        chats = await User.populate( chats, {
            // Update data at the given path in the object:
            path: 'latestMessage.sender',
            select: "name avatar email",
        } );

        return res.status( 200 ).send( {
            data: chats,
            message: "Chats fetched successfully.",
            success: true,
        } );
    } catch ( error ) {
        return res.status( 400 ).send( {
            message: error.message,
            success: false,
        } );
    }
} );



const fetchPublicChats = asyncHandler( async ( req, res ) => {
    try {
        // Find all chats in database that the logged in user is a part of.
        let chats = await Chat.find( {
            isPublicChat: true,
        } )
            //    .populate( "users", "-password" )
            //    .populate( "groupAdmin", "-password" )
            //    .populate( "latestMessage" )
            .sort( { updatedAt: -1 } );

        // console.log( "fetchChats :: chats fetched: ", chats );

        // chats = await User.populate( chats, {
        //     // Update data at the given path in the object:
        //     path: 'latestMessage.sender',
        //     select: "name avatar email",
        // } );

        return res.status( 200 ).send( {
            data: chats,
            message: "Public chats fetched successfully.",
            success: true,
        } );
    } catch ( error ) {
        return res.status( 400 ).send( {
            message: error.message,
            success: false,
        } );
    }
} );

export {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
    fetchPublicChats,
    updateChat,
}