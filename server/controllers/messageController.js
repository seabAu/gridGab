import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import generateToken from "../config/generateToken.js";

const debug = process.env.DEBUG || false; 

const sendMessage = asyncHandler( async ( req, res ) => {
    // 
    const { content, chatId } = req.body;
    if ( !content || !chatId ) {
        console.log( "Invalid request" );
        return res.status( 400 ).send( {
            message: "Invalid data submitted into request"
        });
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create( newMessage );

        // Once created, populate the object with details to send back.
        // Notably, we're using the instanced schema, not the one defined in the message model file, so lowercase 'message'
        message = await message.populate( "sender", "name avatar" );
        message = await message.populate( "chat" );

        // For the chat object we just populated, populate the user data inside it. 
        message = await User.populate( message, {
            path: 'chat.users',
            select: 'name avatar email',
        } );

        // Now find the relevant chat and update the latestMessage field. 
        await Chat.findByIdAndUpdate( req.body.chatId, {
            latestMessage: message,
        } );

        
        return res.status( 200 ).send( {
            data: message,
            success: true,
            message: "Success"
        });
    } catch (error) {
        return res.status( 400 ).send( {
            success: false,
            message: error.message
        } );
        throw new Error( error.message );
    }
} );


// /api/message/:chatId
const getMessages = asyncHandler( async ( req, res ) => {
    // 
    try {
        let messages = await Message.find( { chat: req.params.chatId } ).populate(
            "sender",
            "name avatar email"
        );

        console.log(
            "getMessages :: chatId = ", req.params.chatId,
            // " :: ", "messages gathered = ", messages
        );

        return res.status( 200 ).send( {
            data: messages,
            success: true,
            message: "Success"
        });
    } catch (error) {
        return res.status( 400 ).send( {
            success: false,
            message: error.message
        } );
        throw new Error( error.message );
    }
} );

// Delete message.
const deleteMessage = asyncHandler( async ( req, res ) => {
    // 
    let { messageId } = req.params;
    console.log( "deleteMessage => req.params.id = ", messageId );
    try {
        const message = await Message.findById( messageId );

        if ( !message ) {
            return res
                .status( 404 )
                .json( { error: "Message not found" } );
        }

        if ( message.sender._id.toString() !== req.user._id.toString() ) {
            // Not authorized to make a post for someone else.
            return res
                .status( 401 )
                .json( { error: "Not authorized to delete a message sent by someone else." } );
        }

        await Message.findByIdAndDelete( messageId );
        res
            .status( 200 )
            .json( { message: "Message deleted successfully." } );

    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in deleteMessage: ", error.message );
    }
} );

export {
    sendMessage,
    getMessages,
    deleteMessage,
};