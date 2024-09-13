import React from 'react'
import { createContext } from "preact";
import { useContext, useEffect, useState } from 'preact/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    useToast,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import * as util from 'akashatools';

const ChatContext = createContext();

const ChatProvider = ( { children } ) => {
    // Here, the imported child objects is the whole of our chat app.
    const { colorMode, toggleColorMode } = useColorMode();

    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast()

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

        if ( !util.val.isValid( userInfo ) ) {
            navigate( "/" );
        }
        else {
            navigate( "/chat" );
        }
    }, [] );

    useEffect( () => {
        // Store changes to the user
        if ( user !== undefined ) {
            console.log( "ChatProvider :: user changed :: saving: ", user );
            localStorage.setItem( "userInfo", JSON.stringify( user ) );

            if ( !Object.keys( user ).includes( 'token' ) ) {
                // Token somehow got removed from user data. Force relog. 
                // alert( "Your session token has become corrupted somehow. Sorry! Please log in again." );
            }
        }
        else {
            // Else, fetch data because somehow it got wiped. 
            // setFetchUser( true );
        }
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

            // toast: Toast,
            toast,
        } }>
            { children }
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext( ChatContext );
}

export default ChatProvider;

/*
    const Toast = ( config ) => {
        console.log( "ChatProvider toast :: config = ", config );

        let {
            title,
            status,
            description = '',
            variant = 'solid',
            isCLosable = true,
            duration = 5000,
            position = 'top'
        } = config;

        const statuses = [ "success", "info", "warning", "error" ];
        const variants = [ 'solid', 'subtle', 'left-accent', 'top-accent' ];
        const positions = [
            'top',
            'top-right',
            'top-left',
            'bottom',
            'bottom-right',
            'bottom-left',
        ];
        if ( statuses.includes( status ) ) {
            // Invalid status given, change to "info".
            status = "info";
        }

        if ( variants.includes( variant ) ) {
            // Invalid status given, change to "solid".
            variant = "solid";
        }

        if ( positions.includes( position ) ) {
            // Invalid status given, change to "solid".
            position = "bottom-right";
        }

        return toast( {
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: isCLosable,
            position: position,
            variant: variant,
            containerStyle: {
                width: '108px',
                maxWidth: '25%',
                bg: useColorModeValue(
                    'gray.100',
                    'gray.800'
                ),
                margin: 0,
                padding: 0,
            },

        } );
    }
*/
