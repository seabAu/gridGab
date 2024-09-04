import React from 'react'
import { createContext } from "preact";
import { useContext, useEffect, useState } from 'preact/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ( { children } ) => {
    // Here, the imported child objects is the whole of our chat app.

    const navigate = useNavigate();
    const location = useLocation();

    // This state is accessable through the whole of our app.
    const [ debug, setDebug ] = useState(true);
    const [ user, setUser ] = useState();
    const [ selectedChat, setSelectedChat ] = useState();
    const [ chats, setChats ] = useState([]);
    const [ fetchChats, setFetchChats ] = useState( false );
    const [ notifications, setNotifications ] = useState( [] );

    
    useEffect(() => {
        const userInfo = JSON.parse(
            localStorage.getItem( "userInfo" )
        );
        console.log( "ChatProvider :: user data fetched: ", userInfo );

        setUser( userInfo );

        if ( !userInfo ) {
            navigate( "/" );
        }
    }, [] );
    
    return (
        <ChatContext.Provider value={ {
            user,
            setUser,
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
        } }>
            { children }
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext( ChatContext );
}

export default ChatProvider;
