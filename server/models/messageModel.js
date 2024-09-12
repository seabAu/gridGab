
import mongoose from "mongoose";
import populate from "mongoose-autopopulate";

const messageModel = mongoose.Schema( {

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },

    content: {
        type: String,
        trim: true
    },

    // content: {
    //     type: {
    //         text: {
    //             type: String,
    //             default: "",
    //             trim: true
    //         },
    //         img: {
    //             type: String,
    //             default: ""
    //         },
    //     }
    // },

    attachments: {
        type: [ String ],
        default: []
    },

    // ID of the chat this message belongs to. 
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
    },
    readBy: [ { type: mongoose.Schema.Types.ObjectId, ref: "users" } ],
}, {
    // This adds "createdAt" and "updatedAt" timestamps automatically.
    timestamps: true,
    _id: true,
    // plugin: populate
} );
messageModel.plugin( populate );

const Message = mongoose.model( "messages", messageModel );
export default Message;

