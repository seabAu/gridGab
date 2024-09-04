
// Router configuration
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

const app = express();
import cors from 'cors';
app.use( express.json() );


// Connect to DB.
import connectDB from './config/dbConfig.js';
connectDB();
console.log( "DB URL: ", process.env.MONGO_URI );

const port = process.env.PORT || 5025;
const clientendpoint = process.env.BASE_URL || 'http://localhost';
const clientport = process.env.CLIENT_PORT || 5173;

// ROUTES
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Dummy data.
import chats from './data/data.js';


// Main server and db routing. // 

// Avoid CORS errors.
app.use(
    cors( {
        // origin: "localhost",
        // origin: "http://localhost:3000",
        // optionsSuccessStatus: 200,
        origin: "*",
    } ),
);


// ROUTES //

// User routes
app.use( '/api/user', userRoutes );
app.use( '/api/chat', chatRoutes );
app.use( '/api/message', messageRoutes );



//////////// ------ DEPLOYMENT CODE ------ ////////////

const __dirnameBuild = path.resolve();
if ( process.env.NODE_ENV === 'production' ) {
    // Production
    app.use( express.static( path.join(
        __dirnameBuild,
        "/client/dist"
    ) ) );

    app.get( '*', ( req, res ) => {
        res.sendFile( path.resolve(
            __dirnameBuild,
            "client",
            "dist",
            "index.html"
        ) );
    } )
}
else {
    // Development
    // Responding to homepage requests.
    app.get( "/", ( req, res ) => {
        res.send(
            "API is running successfully."
        );
    } );

}

//////////// ------ DEPLOYMENT CODE ------ ////////////



app.use( notFound );
app.use( errorHandler );

// Fetch all chats.
app.get( "/api/chat", ( req, res ) => {
    console.log( "/api/chat => Sending chats to client: ", chats );
    res.send( chats );
} );

// Fetch all chat IDs.
app.get( "/api/ids", ( req, res ) => {
    const chatIDs = chats.map( ( c ) => c._id );
    res.send( chatIDs );
} );

// Fetch a specific chat log.
app.get( "/api/chat/:id", ( req, res ) => {
    console.log( req.params.id );
    const chat = chats.find( ( c ) => c._id === req.params.id );
    res.send( chat );
} );



// Boot up server.
const server = app.listen( port, () => {
    console.log( `Server started on port ${ port }.` );
} );

// Socket.IO import // 
import { Server } from "socket.io";
import { createServer } from "http";
const httpServer = createServer( app );

// Socket.IO Message Handling // 
const io = new Server( server, {
    /* options */
    // Amount of time to wait while inactive before turning off (in ms)
    pingTimeout: 60000, // 60 seconds
    cors: {
        origin: `${ clientendpoint }:${ clientport }`,
    },
}
);

// Called when a new user connects to the server. 
io.on( "connection", ( socket ) => {
    console.log( `Connected to socket.io :: ${ clientendpoint }:${ port } => ${ clientendpoint }:${ clientport }.` );
    
    // Called on receiving setup command.
    socket.on( 'chat.setup', ( userData ) => {
        // Create unique room for this user. 
        socket.join( userData._id ); 

        console.log( "Connected: ", userData._id );

        socket.emit( 'chat.connected' );
    } );


    // On joining a chat room. 
    socket.on( 'chat.join', ( room_id ) => {
        // Add user to room. 
        // If/when other user(s) join the room, they will be added separately. 
        socket.join( room_id );
        console.log( "User joined room: ", room_id );
    } );

    socket.on( 'chat.typing.start', ( input ) => {
        const { room_id, user_id } = input; 
        console.log( "chat.typing.start", input );

        socket.in( room_id ).emit( 'chat.typing.start', user_id );
    } );

    socket.on( 'chat.typing.stop', ( input ) => {
        const { room_id, user_id } = input; 
        console.log( "chat.typing.stop", input );

        socket.in( room_id ).emit( 'chat.typing.stop', user_id );
    } );

    // On receiving a new message. 
    socket.on( 'chat.message.new', ( newMessage ) => {
        let chat = newMessage.chat;

        console.log( "Received message: ", newMessage );
        // If chat has no users, return.
        if ( !chat.users ) {
            return console.log( 'chat.users not defined' );
        }

        chat.users.forEach( ( user ) => {
            console.log( "chat.users.foreach :: user = ", user );
            if ( user._id === newMessage.sender._id ) {
                // If sent by this user, return.
                // Else it would result in double messages showing.
                return;
            }
            else {
                // Emit the new message object to each user in the chat. 
                socket.in( user._id ).emit( 'chat.message.received', newMessage );
            }
        } )
    } );

    

} );


