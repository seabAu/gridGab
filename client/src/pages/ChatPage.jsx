import {
    useEffect,
    useState,
} from 'preact/hooks';
import React from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import ChatList from '../components/Chat/ChatList';
import ChatContent from '../components/Chat/ChatContent';
import SideDrawer from '../components/Page/SideDrawer';
import {
    Box,
    useColorMode,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import ChatContainer from '../components/Chat/ChatContainer';
import Content from '../components/Page/Content';

const ChatPage = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const {
        user,
        setUser,
        fetchUser,
        setFetchUser,
        refresh,
        setRefresh,
        toast
    } = ChatState();

    // const fetchChats = async () => {
    //     const {data} = await axios.get( '/api/chat' );
    //     // console.log( "Data retrieved for chats: ", data );
    //     setChats( data );
    // }

    const getProfile = async () => {
        setFetchUser( false );
        console.log( "getProfile :: ", user );
        let response;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };

            response = await axios.get( `/api/user/${ user._id }`, config );
            console.log( "getProfile :: response = ", response );

            if ( response.data ) {
                console.log( "getProfile :: response.data.data = ", response.data.data );

                let data = response.data.data;
                setUser( data );
                toast( {
                    title: "Success",
                    description: response.data.message,
                    status: "success",
                } );
            }
        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( error );
            toast( {
                title: "An error occurred",
                description: msg,
                status: "error",
            } );
        }
    }

    useEffect( () => {
        if ( fetchUser ) {
            // Re-fetch the user data. 
            console.log( "ChatPage :: Getting the user profile." );
            getProfile();
            // setFetchUser( false );
        }
    }, [ fetchUser ] );

    console.log(
        'ChatPage :: user is = ',
        user
    );

    return (

        <div
            // Container for whole chat page. 
            className='chat-container'
            style={ { width: '100%' } }
            bg={ useColorModeValue(
                'gray.light',
                'gray.dark'
            ) }

        >
            <>
                { user && <Content /> }
                <Box
                    display={ 'flex' }
                    justifyContent={ 'space-between' }
                    w={ '100%' }
                    h={ `${ 91.5 }vh` }
                    p={ '4px' }
                >
                    { user && <ChatList refresh={ refresh } /> }
                    { user && <ChatContainer refresh={ refresh } setRefresh={ setRefresh } /> }
                </Box>
            </>

        </div>
    );
};

export default ChatPage;
