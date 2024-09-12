import React from 'react'
import { createContext } from "preact";
import { useContext, useEffect, useState } from 'preact/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatContext = createContext();

const ChatProvider = ( { children } ) => {
    // Here, the imported child objects is the whole of our chat app.

    const navigate = useNavigate();
    const location = useLocation();

    // This state is accessable through the whole of our app.
    const [ debug, setDebug ] = useState( true );
    const [ user, setUser ] = useState();
    const [ selectedChat, setSelectedChat ] = useState();
    const [ chats, setChats ] = useState( [] );
    const [ fetchChats, setFetchChats ] = useState( false );
    const [ notifications, setNotifications ] = useState( [] );
    const [ fetchUser, setFetchUser ] = useState( false );
    const [ openSearchDrawer, setOpenSearchDrawer ] = useState( false );


    useEffect( () => {
        let storedInfo = localStorage.getItem( "userInfo" );
        let userInfo;
        console.log( "ChatProvider :: user data fetched: ", storedInfo );
        if ( storedInfo !== undefined && storedInfo.toString() !== "undefined" ) {
            userInfo = JSON.parse(
                storedInfo
            );
        }
        console.log( "ChatProvider :: user data fetched: ", storedInfo, userInfo );

        setUser( userInfo );

        if ( !userInfo ) {
            navigate( "/" );
        }
        else {
            navigate( "/chat" );
        }
    }, [] );

    useEffect( () => {
        // Store changes to the user
        console.log( "ChatProvider :: user changed :: saving: ", user );
        localStorage.setItem( "userInfo", JSON.stringify( user ) );
    }, [ user ] );

    return (
        <ChatContext.Provider value={ {
            user,
            setUser,
            fetchUser,
            setFetchUser,
            chats,
            setChats,
            selectedChat,
            setSelectedChat,
            fetchChats,
            setFetchChats,
            debug,
            setDebug,
            notifications,
            setNotifications,
            openSearchDrawer,
            setOpenSearchDrawer,
        } }>
            { children }
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext( ChatContext );
}

export default ChatProvider;
