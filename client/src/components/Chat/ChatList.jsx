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

const ChatList = () => {
    const {
        user,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChats,
        setFetchChats
    } = ChatState();
    const [ loggedUser, setLoggedUser ] = useState();
    const toast = useToast();
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
                toast( {
                    title: "Success",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                } );
            }
        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( "getChats :: msg = ", msg );
            toast( {
                title: "Error",
                description: msg,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
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
                console.log( "getPublicChats :: data = ", data );
                toast( {
                    title: "Success",
                    description: response.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                } );
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
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            } );
        }
    };

    useEffect( () => {
        // Fetch public chats for joinable rooms dropdown. 
        getPublicChats();
    }, [] );

    useEffect( () => {
        setLoggedUser( JSON.parse( localStorage.getItem( "userInfo" ) ) );
        if ( fetchChats || chats.length === 0 ) getChats();
        // eslint-disable-next-line
    }, [ user, fetchChats ] );

    return (

        <Box
            className="chat-list-panel"
            display={ { base: selectedChat ? "none" : "flex", md: "flex" } }
            flexDir="column"
            alignItems="center"
            p={ '0.125em' }
            w={ { base: "100%", md: "31%" } }
            overflowY="hidden"
            borderRadius="sm"
            borderWidth="1px"
        >
            <Box
                className="chat-list-panel-header"
                display="flex"
                w="100%"
                justifyContent={ 'space-between' }
                alignItems="center"
                overflowY="hidden"
                borderRadius="sm"
                p={ `0.125em` }
                h={ `${ 32 }px` }
                maxH={ `${ 32 }px` }
                // bg={ useColorModeValue( 'white', 'gray.dark' ) }
                bg={
                    useColorModeValue(
                        'blackAlpha.900',
                        'blackAlpha.100'
                    )
                }
            >
                <Text
                    className="chat-list-panel-header-title"
                    // fontSize={ { base: "18px", md: "14px", lg: "10px" } }
                    fontSize={ [ 'sm', 'md', 'lg', 'xl' ] }
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
                    size={ 'sm' }
                    maxH={ `${ 28 }px` }
                    p={ 1 }
                // fontSize={ { base: "12px", md: "10px", lg: "12px" } }
                // rightIcon={ <AddIcon /> }
                >
                    <CreateChatModal>
                        <AddIcon />
                    </CreateChatModal>
                </Button>
            </Box>

            <hr />

            <Box
                className="chat-list-panel-list"
                d="flex"
                justifyContent={ 'flex-end' }
                alignContent={ 'flex-start' }
                w="100%"
                h="100%"
                overflowY={ 'auto' }
                bg={ useColorModeValue( 'white', 'gray.dark' ) }
            >
                {
                    chats ? (
                        <Stack
                            flexDir="column"
                            gap={ '0px' }
                            px={ '0.0125em' }

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
                                                        "#2a5654"
                                                        :
                                                        "#E8E8E8",
                                                    selectedChat === chat
                                                        ?
                                                        'blackAlpha.200'
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

                                                <Text
                                                    letterSpacing={ 1.05 }
                                                    px={ '0.01em' }
                                                    // color={ useColorModeValue( 'violet.900', 'violet.100' ) }
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
                                                                getSender( loggedUser, chat.users )
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
