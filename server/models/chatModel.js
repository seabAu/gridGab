
import mongoose from "mongoose";
import populate from "mongoose-autopopulate";

const chatModel = mongoose.Schema( {
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    // Users involved.
    users: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    } ],
    // For easy fetching of last message without excessive DB calls.
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
    },
    // ???
    // Replace this with user permission levels later, per-chat or server. 
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
}, {
    // This adds "createdAt" and "updatedAt" timestamps automatically.
    timestamps: true,
    _id: true,
    // plugin: populate
} );
chatModel.plugin(populate);

const Chat = mongoose.model( "chats", chatModel );
export default Chat;

