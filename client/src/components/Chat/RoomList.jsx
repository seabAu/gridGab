// Handles displaying select input for available public rooms, action when joining, etc.
import React from 'react'
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import { useEffect, useState } from 'preact/hooks';
import {
    Box,
    FormControl,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Spinner,
    Tag,
    Text,
    useColorMode,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';

const RoomList = ( props ) => {
    const {
        size = 'sm',
        rooms,
        setRooms,
        onClick,
        onHover,
    } = props;

    const {
        user,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChats,
        setFetchChats,
        toast,
    } = ChatState();

    const { colorMode, toggleColorMode } = useColorMode();
    const [ loggedUser, setLoggedUser ] = useState();

    const handleJoinRoom = async ( userData, chatData ) => {
        // For joining the logged-in user to a given chat room
        console.log( "handleJoinRoom :: userData = ", userData, " :: ", "chatData = ", chatData );

        // Check if user is already in group
        if ( chatData.users.find( ( uid ) => uid === user._id ) ) {
            toast( {
                title: "User already in that public chat!",
                status: "error",
                position: "top",
            } );
            return;
        }

        // Check if chat is public. 
        if ( !chatData.isPublicChat ) {
            toast( {
                title: "That chat isn't public!",
                status: "error",
                position: "top",
            } );
            return;
        }

        if ( !userData.token ) {
            // No token in user data for some reason. Return.
            toast( {
                title: "No token saved in session. Please refresh the page and try again.",
                status: "error",
                position: "top",
            } );
            return;
        }

        let response;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ userData.token }`,
                },
            };
            response = await axios.put(
                `/api/chat/add`,
                {
                    chatId: chatData._id,
                    userId: userData._id
                },
                config
            );

            let updatedChat = response.data.data;

            // Replace selected chat's data
            setSelectedChat( updatedChat );

            // Remove current iteration of this chat from chats list, and add the new one. 
            setFetchChats( true );

            /*
            toast( {
                title: "Successfully joined public chat",
                description: response.data.message,
                status: "success",
                position: "bottom",
            } );
            */
        } catch ( error ) {
            toast( {
                title: "Failed to join public chat",
                description: error.response.data.message,
                status: "error",
                position: "bottom",
            } );
        } finally {
            // setLoading( false );
        }
    }

    return (
        rooms && (
            <Box>
                <FormControl
                    id='chatId'
                >
                    <InputGroup
                        size={ 'xs' }
                    >
                        <InputLeftAddon
                            borderColor={ 'blackAlpha.300' }
                            size={ 'xs' }
                        >
                            <Select
                                style={ {
                                    padding: `0px`,
                                    fontSize: `0.875em`,
                                    borderBottom: '0px'
                                } }
                                placeholder='Public Rooms'
                                size={ size }
                                // icon={ <MdArrowDropDown /> }
                                variant={ 'flushed' }
                                onChange={ ( e ) => {
                                    // e.target.value is the room ID, not the name. 
                                    // console.log( "RoomList :: e = ", e );
                                    let roomID = e.target.value;
                                    if ( roomID !== undefined ) {
                                        console.log( roomID );
                                        // Find room info by ID. 
                                        let room = rooms.find( ( r ) => r._id === roomID );
                                        console.log( "RoomList :: ", "Room = ", room );
                                        if ( room !== undefined ) {
                                            handleJoinRoom( user, room );
                                        }
                                    }
                                } }
                            >
                                {
                                    rooms.map( ( room, index ) => {
                                        return (
                                            <option
                                                value={ room._id }

                                            >
                                                <Box
                                                    display={ 'flex' }
                                                    flexDir={ 'row' }
                                                    alignItems={ "center" }
                                                    justifyContent={ 'space-between' }
                                                >
                                                    {
                                                        room.chatName
                                                    }
                                                    <Tag size={ 'xs' } variant={ 'solid' } colorScheme={ 'blackAlpha' }>
                                                        {
                                                            `   (${ room.users.length } users)`
                                                        }
                                                    </Tag>
                                                </Box>
                                            </option>
                                        );
                                    } )
                                }
                            </Select>
                        </InputLeftAddon>

                    </InputGroup>
                </FormControl>
            </Box>
        )
    )
}

export default RoomList
