import React from 'react';
import { ChatState } from '../../context/ChatProvider';
import {
    AvatarGroup,
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    useColorMode,
    useColorModeValue,
    useToast,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderData } from '../../config/ChatLogic';
import ProfileModal from '../User/ProfileModal';
import UpdateChatModal from './UpdateChatModal';
import { useEffect, useState } from 'preact/hooks';
import axios from 'axios';
import ChatMessages from './ChatMessages';
import * as util from 'akashatools';


// Socket.io import and setup.
import { io } from 'socket.io-client';
import ChatTypingIndicator from './ChatTypingIndicator';
import UserAvatar from '../User/UserAvatar';
const ENDPOINT = "http://localhost:5025";
let socket;

// When a message is sent, this is for whether to emit the message or show a notification. 
let selectedChatCompare;


const ChatContent = () => {
    // Shows the messages of a given chat message log. IE, the content of a chat. 
    const {
        // debug, 
        // setDebug, 
        user, // This user
        selectedChat,
        setSelectedChat,
        fetchChats, // "fetchAgain"
        setFetchChats, // "setFetchAgain"
        notifications,
        setNotifications,
    } = ChatState();
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();

    const [ messages, setMessages ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const [ newMessage, setNewMessage ] = useState();
    const [ isTyping, setIsTyping ] = useState( false ); // If we are typing or not, NOT used for indicator. 
    const [ typingIndicator, setTypingIndicator ] = useState( false ); // Flag to toggle typing indicator
    const [ typingUsers, setTypingUsers ] = useState( [] ); // List of currently typing users. 

    const [ socketConnected, setSocketConnected ] = useState( false );

    useEffect( () => {
        // Socket.io setup.
        socket = io( ENDPOINT );
        console.log( "ChatContent.js :: socket = ", socket );

        socket.emit( 'chat.setup', user );
        socket.on( 'chat.connected', () => {
            setSocketConnected( true );

            // Set currently active chat data. 
            selectedChatCompare = selectedChat;
            console.log( "Socket.on(chat.connected) :: selectedChatCompare = ", selectedChatCompare );

        } );

        // When server notifies us that someone other than us is typing.
        socket.on( 'chat.typing.start', ( user_id ) => {
            // console.log( "chat.typing.start => user_id = ", user_id );
            // Only toggle indicator and add user id to the list if it's not our ID.
            if ( user_id !== user._id ) {
                setTypingIndicator( true );
                setTypingUsers( [ ...typingUsers, user_id ] );
            }
        } );

        // When server notifies us that someone other than us WAS typing and has finished.
        socket.on( 'chat.typing.stop', ( user_id ) => {
            // console.log( "chat.typing.stop => user_id = ", user_id );
            let updatedTypingUsers = [ ...typingUsers ].filter( uid => ( ( uid !== user._id ) && ( uid !== user_id ) ) );
            setTypingUsers( updatedTypingUsers );
        } );

        // TODO :: Refactor this to send and receive a list of user IDs / names that are currently typing. Once that list is empty, then we stop showing the typing indiciator.



    }, [] );

    useEffect( () => {
        if ( typingUsers.length ) {
            setTypingIndicator( true );
        }
        else {
            setTypingIndicator( false );
        }
    }, [ typingUsers, typingIndicator ] );

    useEffect( () => {
        // Socket - on new messages.
        socket.on( 'chat.message.received', ( newMessageReceived ) => {
            console.log( "Socket.on(chat.message.received) :: selectedChatCompare = ", selectedChatCompare, " :: ", "newMessageReceived = ", newMessageReceived );
            if ( !selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id ) {
                // Make sure to only display new messages in the correct chat.
                // If not in that chat, show a notification bubble. 
                if ( !notifications.includes( newMessageReceived ) ) {
                    // If not in the list of notifications (unread incoming last messages), add it to the list.
                    setNotifications( [ newMessageReceived, ...notifications ] );

                    // Update list of chats.
                    setFetchChats( !fetchChats );
                }
            }
            else {
                // Add to messages list.
                // NOTE: MAY need to sort. 
                setMessages( [ ...messages, newMessageReceived ] );
            }
        }
        );
    } );

    const getMessages = async () => {
        if ( !selectedChat ) {

            return;
        }
        let response;
        try {
            setLoading( true );

            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`
                },
            };

            response = await axios.get(
                `/api/message/${ selectedChat._id }`,
                config
            );

            let responseMsg = response.data.data;
            setLoading( false );

            // Append message to end of messages array.
            // setMessages( [ ...messages, responseMsg ] );
            setMessages( responseMsg );

            // Push scrollbar down if applicable.

            // Join this user to the selected chatroom's ID. 
            socket.emit( 'chat.join', selectedChat._id );
        } catch ( error ) {
            toast( {
                title: "Error",
                description: "Failed to load messages. Please refresh the page: " + error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            } );
        }

    }

    const sendMessage = async ( e ) => {
        if ( e.key === "Enter" && newMessage ) {
            // Submitted via enter key

            socketSendTyping( false );

            let response;
            try {
                // setLoading( true );

                const config = {
                    headers: {
                        Authorization: `Bearer ${ user.token }`,
                        "Content-type": "application/json"
                    },
                };

                let msg = newMessage;
                setNewMessage( "" );
                response = await axios.post(
                    `/api/message`,
                    {
                        "content": msg,
                        "chatId": selectedChat._id,
                    },
                    config
                );

                // console.log(
                //     "ChatContent",
                //     " :: ", "sendMessage",
                //     " :: ", "token = ", user.token,
                //     " :: ", "response = ", response,
                //     " :: ", "response.data.data = ", response.data.data
                // );
                // const data = response.data;

                if ( response.data ) {

                    let data = response.data.data;
                    setMessages( [ ...messages, data ] );

                    toast( {
                        title: "Successfully sent message.",
                        description: response.data.message,
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    } );

                    // Emit message to socket.io server.
                    socket.emit( 'chat.message.new', data );
                }

            } catch ( error ) {

                toast( {
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                } );
            }
        }
    }

    const socketSendTyping = ( is_typing ) => {
        if ( is_typing ) {
            socket.emit( 'chat.typing.start', { room_id: selectedChat._id, user_id: user._id } );
        }
        else {
            socket.emit( 'chat.typing.stop', { room_id: selectedChat._id, user_id: user._id } );
        }
    }

    const typingHandler = ( e ) => {
        // Update stored temporary message
        setNewMessage( e.target.value );

        // Typing indicator logic
        if ( !socketConnected ) {
            return;
        }

        // Special case - if the input field is empty (or was cleared), send typing-stop and skip below code. 
        if ( e.target.value === "" ) {
            socketSendTyping( false );
            setIsTyping( false );
            return;
        }

        if ( !isTyping ) {
            // If not already set to true, toggle it.
            // To avoid spamming the server with "we're typing" on every keypress. 
            setIsTyping( true );
            socketSendTyping( true );
        }

        // Throttle function to prevent spam
        let timeStart = new Date().getTime();
        let timerLength = 3000;
        setTimeout( () => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - timeStart;

            if ( timeDiff >= timerLength && isTyping ) {
                socket.emit( 'chat.typing.stop', { room_id: selectedChat._id, user_id: user._id } );
                setIsTyping( false );
                socketSendTyping( false );
            }
        }, timerLength );
    }

    useEffect( () => {
        // Fetch messages for this conversation. 
        getMessages();
    }, [ selectedChat, user ] );

    // console.log( "ChatContent :: messages array = ", messages, " :: ", "selectedChat = ", selectedChat );
    console.log( "-----------", "notifications: ", notifications );

    return (
        <>
            { selectedChat ? (
                <>
                    <Box
                        p={ `0.125em` }
                        h={ `${ 32 }px` }
                        maxH={ `${ 32 }px` }
                        mb={ '3px' }
                        py={ 1 }
                        w={ '100%' }
                        display={ 'flex' }
                        justifyContent={ {
                            base: 'space-between',
                        } }
                        alignItems={ 'center' }
                        bg={
                            useColorModeValue(
                                'blackAlpha.900',
                                'blackAlpha.100'
                            )
                        }
                    >
                        <IconButton
                            display={ {
                                base: 'flex',
                                md: 'none',
                            } }
                            size={ "sm" }
                            icon={ <ArrowBackIcon /> }
                            onClick={ () =>
                                setSelectedChat( '' )
                            }
                        />

                        {
                            // If group chat, show chat name. 
                            // If not, show recipient name. 
                            selectedChat.isGroupChat ? (
                                <Box
                                    px={ 2 }
                                    display={ 'flex' }
                                    w={ '100%' }
                                    justifyContent={ {
                                        base: 'space-between',
                                    } }
                                    alignItems={ 'center' }
                                    fontSize={ {
                                        base: '20px',
                                        md: '24px',
                                    } }
                                    flexDir={ 'row' }
                                    flexWrap={ 'nowrap' }
                                >
                                    {
                                        // Chat Name
                                    }
                                    <Box
                                        display={ 'flex' }
                                        flexDir={ 'row' }
                                        alignItems={ 'center' }
                                        gap={ 2 }
                                    >

                                        { util.val.isValidArray( selectedChat.users, true ) && (
                                            <AvatarGroup size={ 'sm' } max={ 2 } p={ 1 }>
                                                {
                                                    // Map out each avatar icon. 
                                                    selectedChat.users.map( ( u ) => {
                                                        return (
                                                            <UserAvatar userData={ u } />
                                                        );
                                                    } )
                                                }
                                            </AvatarGroup>
                                        ) }

                                        <Text
                                            fontSize={ 'md' }
                                            as={ 'b' }
                                            p={ 0 }
                                            m={ 0 }
                                        >
                                            {
                                                selectedChat?.chatName
                                            }
                                        </Text>
                                    </Box>

                                    <UpdateChatModal />
                                </Box>
                            ) : (
                                <Box>
                                    {
                                        getSender( user, selectedChat.users )
                                    }
                                    <UserAvatar
                                        userData={
                                            getSenderData(
                                                user,
                                                selectedChat.users
                                            )
                                        }
                                    />
                                </Box>
                            )
                        }
                    </Box>


                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={ 1 }
                        bg={ useColorModeValue( 'gray.200', 'gray.dark' ) }
                        w="100%"
                        h="100%"
                        borderRadius="sm"
                        overflowY="hidden"
                    >
                        {
                            loading
                                ?
                                ( <Spinner
                                    size={ "xl" }
                                    w={ 20 }
                                    h={ 20 }
                                    alignSelf={ 'center' }
                                    margin={ 'auto' }
                                /> )
                                :
                                ( <>
                                    <ChatMessages messages={ messages } />
                                </> )
                        }

                        <FormControl
                            size={ 'xs' }
                            onKeyDown={ sendMessage }
                            mt={ 3 }
                            isRequired
                        >
                            { typingIndicator ? (
                                <ChatTypingIndicator show={ typingIndicator }>
                                    <div>{
                                        `${ typingUsers.length } users are typing . . .`
                                    }</div>
                                </ChatTypingIndicator>
                            ) : ( <></> ) }
                            <Input
                                size={ 'xs' }
                                borderRadius={ 'full' }
                                variant='outline'
                                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                                placeholder="Begin typing"
                                fontSize={ '12px' }
                                value={ newMessage }
                                onChange={ typingHandler }
                                outline={ '0.1em' }
                                _focus={
                                    {
                                        outlineColor: useColorModeValue( 'gray.100', 'gray.900' ),
                                    }
                                }
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent={ 'center' }
                    h={ '100%' }>
                    <Text
                        pb={ 3 }
                        fontFamily='Work sans'>
                        Click on a user to start chatting
                    </Text>
                </Box>
            ) }
        </>
    );
};

export default ChatContent;
