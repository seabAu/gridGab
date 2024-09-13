import React from 'react'
import axios from 'axios';
import { Box, useToast, useColorModeValue, Button, Stack, Text } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import { useEffect, useState } from 'preact/hooks';
import { AddIcon } from '@chakra-ui/icons';
import { getSender, getChatUsers } from '../../config/ChatLogic';
import ChatLoading from './ChatLoading';
import CreateChatModal from './CreateChatModal';
import UserListItem from '../User/UserListItem';
import RoomList from './RoomList';

const ChatList = ( props ) => {
    const {
        headerHeight = `${ 48 }px`,
        debug
    } = props;

    const {
        user,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChats,
        setFetchChats,
        toast
    } = ChatState();
    const [ loggedUser, setLoggedUser ] = useState();
    // const toast = useToast();
    const [ rooms, setRooms ] = useState( [] );

    const getChats = async () => {
        // Fetch the list of available message logs, between you and another person or group messages. 
        if ( !user ) {
            console.log( "ChatList :: getChats :: No user logged in." );
            return;
        }
        setFetchChats( false );
        console.log( "getChats :: ", user._id );
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };

            const response = await axios.get( "/api/chat", config );

            if ( response.data ) {
                let data = response.data.data;
                setChats( data );
                /*
                toast( {
                    title: "Success",
                    description: response.data.message,
                    status: "success",
                } );
                */
            }
        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            
            toast( {
                title: "Error",
                description: msg,
                status: "error",
            } );
        } finally {
            setFetchChats( false );
        }
    };

    const getPublicChats = async () => {
        // Fetch the list of available message logs, between you and another person or group messages. 
        if ( !user ) {
            console.log( "ChatList :: getChats :: No user logged in." );
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };

            const response = await axios.get( "/api/chat/rooms", config );

            if ( response.data ) {
                let data = response.data.data;
                setRooms( data );
                /*
                toast( {
                    title: "Success",
                    description: response.data.message,
                    status: "success",
                } );
                */
            }
        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( "getPublicChats :: error :: msg = ", msg );
            toast( {
                title: "Error",
                description: msg,
                status: "error",
            } );
        }
    };

    useEffect( () => {
        // Fetch public chats for joinable rooms dropdown. 
        getPublicChats();
    }, [] );

    useEffect( () => {
        console.log( "ChatList :: change in user or fetchChats detected. Saving new user data to local storage." );
        setLoggedUser(
            JSON.parse(
                localStorage.getItem( "userInfo" )
            )
        );
        if ( fetchChats || chats.length === 0 ) getChats();
    }, [ user, fetchChats ] );

    return (
        <Box
            className="chat-list-panel"
            display={ { base: selectedChat ? "none" : "flex", md: "flex" } }
            flexDir="column"
            alignItems="center"
            w={ { base: "100%", md: "31%" } }
            overflowY="hidden"
            borderRadius="sm"
            borderWidth="1px"
            borderColor={
                useColorModeValue(
                    'blackAlpha.100',
                    'whiteAlpha.100'
                )
            }
        >
            <Box
                className="chat-list-panel-header"
                overflowY="hidden"
                p={ `0.125em` }
                h={ `${ headerHeight }` }
                maxH={ `${ headerHeight }` }
                // bg={ useColorModeValue( 'white', 'gray.dark' ) }
                bg={
                    useColorModeValue(
                        'blackAlpha.100',
                        'whiteAlpha.100'
                    )
                }
                mb={ '2px' }
                px={ `0.125em` }
                w={ '100%' }
                display={ 'flex' }
                justifyContent={ {
                    base: 'space-between',
                } }
                alignItems={ 'center' }
                borderRadius="sm"
            // bg={ useColorModeValue( 'white', 'gray.dark' ) }
            >
                <Text
                    className="chat-list-panel-header-title"
                    // fontSize={ { base: "18px", md: "14px", lg: "10px" } }
                    fontSize={ [ 'sm', 'md', 'lg', 'xl' ] }
                    P={ 0 }
                    m={ 0 }
                >
                    Chats
                </Text>

                {
                    // Public rooms list select input.
                }

                <RoomList rooms={ rooms } handleFunc={ () => handleJoinRoom } />

                {
                    // NEW CHAT button
                }
                <Button
                    display="flex"
                    // fontSize={ { base: "12px", md: "10px", lg: "12px" } }
                    // rightIcon={ <AddIcon /> }
                    size={ 'xs' }
                    maxW={ `${ 20 }px` }
                    p={ 1 }
                >
                    <CreateChatModal>
                        <AddIcon fontSize={ 'xs' } p={ 0 } />
                    </CreateChatModal>
                </Button>
            </Box>

            <hr />

            <Box
                className="chat-list-panel-list"
                display="flex"
                justifyContent={ `stretch` }
                alignContent={ 'stretch' }
                w="100%"
                h="100%"
                overflowY={ 'auto' }
                bg={ useColorModeValue( 'gray.300', 'gray.dark' ) }
            >
                {
                    chats ? (
                        <Stack
                            flexDir="column"
                            gap={ '0px' }
                            px={ '0.0125em' }
                            flexGrow={ 1 }
                        >
                            {
                                chats.map( ( chat, index ) => {
                                    // console.log( "ChatList.jsx :: chat #", index, " :: ", " = ", chat );
                                    return (

                                        <Box
                                            onClick={ () => setSelectedChat( chat ) }
                                            cursor="pointer"
                                            color={ selectedChat === chat ? "white" : "black" }
                                            py={ '0.25em' }
                                            px={ '0.25em' }
                                            borderRadius="sm"
                                            boxShadow={
                                                selectedChat === chat
                                                    ?
                                                    'inset 0px 0px 10px -4px #000000'
                                                    :
                                                    'none'
                                            }
                                            key={ chat._id }
                                            bg={
                                                useColorModeValue(
                                                    selectedChat === chat
                                                        ?
                                                        "#ffffff"
                                                        :
                                                        "#E8E8E8",
                                                    selectedChat === chat
                                                        ?
                                                        'blackAlpha.00'
                                                        :
                                                        'blackAlpha.100'
                                                )
                                            }
                                            _hover={ {
                                                backgroundColor: useColorModeValue( 'gray.100', 'blackAlpha.200' ),
                                                color: useColorModeValue( 'gray.800', 'gray.100' ),
                                                boxShadow: `inset 0px 0px 12px -8px #000000`,
                                            } }
                                        >

                                            {
                                                // Chat name
                                            }
                                            <Box
                                                px={ '0.0225em' }
                                                w={ '100%' }
                                                display={ 'flex' }
                                                flexDir={ 'column' }
                                                justifyContent={ {
                                                    base: 'space-between',
                                                } }
                                                alignItems={ 'flex-start' }
                                            >

                                                <Box
                                                    px={ '0.01em' }
                                                    display={ 'flex' }
                                                    flexDir={ 'row' }
                                                >
                                                    <Text
                                                        letterSpacing={ 1.05 }
                                                        px={ '0.01em' }
                                                        color={ useColorModeValue( 'gray.900', 'gray.100' ) }
                                                        // fontSize={ [ 'sm', 'md', 'lg', 'xl' ] }
                                                        fontSize={ {
                                                            base: `${ 12 }px`,
                                                            sm: `${ 12 }px`,
                                                            md: `${ 12 }px`,
                                                            lg: `${ 14 }px`
                                                        } }
                                                    >
                                                        {
                                                            !chat.isGroupChat
                                                                ?
                                                                (
                                                                    // getSender( loggedUser, chat.users )
                                                                    getSender( user, chat.users )
                                                                )
                                                                :
                                                                (
                                                                    chat.chatName
                                                                        ?
                                                                        // Has a chat name, show it instead of user list. 
                                                                        ( chat.chatName )
                                                                        :
                                                                        // Has no chat name set, use user list. 
                                                                        ( getChatUsers( chat.users ).join( ', ' ) )
                                                                )
                                                        }
                                                    </Text>

                                                </Box>
                                            </Box>

                                            {
                                                // Last message in the conversation. 
                                                // Trim if too long, add ellipsis after. 
                                            }
                                            {
                                                chat.latestMessage ?
                                                    (
                                                        <Box
                                                            px={ '0.0225em' }
                                                            gap={ '0.125em' }
                                                            w={ '100%' }
                                                            display={ 'flex' }
                                                            justifyContent={ {
                                                                base: 'space-between',
                                                            } }
                                                            alignItems={ 'flex-start' }
                                                        >
                                                            <Text
                                                                color={ 'blue' }
                                                                fontSize={ {
                                                                    base: '0.85em',
                                                                    md: '0.75em',
                                                                } }
                                                                fontFamily={ 'Work sans' }
                                                                display={ 'flex' }
                                                            >
                                                                { '>' }
                                                            </Text>

                                                            <Text
                                                                fontSize={ {
                                                                    base: '0.85em',
                                                                    md: '0.75em',
                                                                } }
                                                                pb={ '0.125em' }
                                                                px={ '0.01em' }
                                                                w={ '100%' }
                                                                fontFamily={ 'Work sans' }
                                                                display={ 'flex' }
                                                                justifyContent={ {
                                                                    base: 'flex-start',
                                                                } }
                                                                alignItems={ 'center' }>
                                                                {
                                                                    chat.latestMessage.content?.toString()
                                                                }
                                                            </Text>
                                                        </Box>
                                                    )
                                                    :
                                                    (
                                                        <></>
                                                    )
                                            }
                                        </Box>
                                    );
                                } )
                            }
                        </Stack>
                    ) : ( <ChatLoading /> )
                }
            </Box>
        </Box>
    )
}

export default ChatList
