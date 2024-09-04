import React from 'react'
import axios from 'axios';
import { Box, useToast, useColorModeValue, Button, Stack, Text } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import { useEffect, useState } from 'preact/hooks';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../../config/ChatLogic';
import ChatLoading from './ChatLoading';
import CreateChatModal from './CreateChatModal';
import UserListItem from './UserListItem';

const ChatList = () => {
    const { user, selectedChat, setSelectedChat, chats, setChats, fetchChats, setFetchChats } = ChatState();
    const [ loggedUser, setLoggedUser ] = useState();
    const toast = useToast();

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

            console.log(
                "ChatList",
                " :: ", "getChats",
                " :: ", "token = ", user.token,
                " :: ", "response = ", response,
                " :: ", "response.data.data = ", response.data.data
            );

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
            toast( {
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            } );
        }
    };

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
                p={ '0.1125em' }
                fontSize={ { base: "24px", md: "28px" } }
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent={ 'space-between' }
                alignItems="center"
                overflowY="hidden"
                borderRadius="sm"
                bg={ useColorModeValue( 'white', 'gray.dark' ) }
            >
                Chats
                <Button
                    display="flex"
                    fontSize={ { base: "17px", md: "10px", lg: "17px" } }
                    rightIcon={ <AddIcon /> }
                >
                    <CreateChatModal>
                        New Chat
                    </CreateChatModal>
                </Button>
            </Box>

            <hr />
            <Box
                d="flex"
                flexDir="column"
                justifyContent={ 'flex-end' }
                alignContent={ 'flex-start' }
                p={ '0.0125em' }
                // bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="sm"
                overflowY="hidden"
                bg={ useColorModeValue( 'white', 'gray.dark' ) }
            >
                {
                    chats ? (
                        <Stack overflowY={ 'scroll' }>
                            {
                                chats.map( ( chat, index ) => {
                                    console.log( "ChatList.jsx :: chat #", index, " :: ", " = ", chat );
                                    return (

                                        <Box
                                            onClick={ () => setSelectedChat( chat ) }
                                            cursor="pointer"
                                            color={ selectedChat === chat ? "white" : "black" }
                                            py={ '0.0125em' }
                                            px={ '0.25em' }
                                            borderRadius="sm"
                                            key={ chat._id }
                                            bg={
                                                useColorModeValue( selectedChat === chat ? "#38B2AC" : "#E8E8E8", selectedChat === chat ? 'gray.700' : 'gray.dark' )
                                            }
                                            _hover={ {
                                                backgroundColor: useColorModeValue( 'gray.100', 'gray.800' ),
                                                color: useColorModeValue( 'gray.800', 'gray.100' ),
                                            } }
                                        >
                                            <Text
                                                fontSize={ {
                                                    base: '0.90em',
                                                    md: '0.90em',
                                                } }
                                                pt={ '0.125em' }
                                                px={ '0.0em' }
                                            >
                                                {
                                                    !chat.isGroupChat
                                                        ?
                                                        (
                                                            <Text
                                                                fontSize={ {
                                                                    base: '0.85em',
                                                                    md: '0.75em',
                                                                } }
                                                                px={ '0.01em' }
                                                                fontFamily={ 'Work sans' }
                                                                color={ useColorModeValue( 'gray.dark', 'gray.light' ) }
                                                            >
                                                                {
                                                                    getSender( loggedUser, chat.users )
                                                                }

                                                            </Text>
                                                        )
                                                        :
                                                        (

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
                                                                    fontSize={ {
                                                                        base: '1.125em',
                                                                        md: '1.125em',
                                                                    } }
                                                                    fontWeight={ 400 }
                                                                    letterSpacing={ 1.125 }
                                                                    fontFamily={ 'Work sans' }>
                                                                    { chat.chatName }
                                                                </Text>
                                                                <Text
                                                                    fontSize={ {
                                                                        base: '0.85em',
                                                                        md: '0.75em',
                                                                    } }
                                                                    // pb={ '0.125em' }
                                                                    px={ '0.01em' }
                                                                    fontFamily={ 'Work sans' }
                                                                    color={ useColorModeValue( 'gray.600', 'gray.400' ) }
                                                                >
                                                                    { chat.users.map( ( u ) => {
                                                                        return (
                                                                            u.display_name
                                                                        );
                                                                    } ).join( ', ' ) }
                                                                </Text>
                                                            </Box>
                                                        )
                                                }
                                            </Text>

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
                                                        chat.latestMessage?.content?.toString()
                                                    }
                                                </Text>
                                            </Box>

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
