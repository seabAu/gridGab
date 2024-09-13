import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import { useState } from 'preact/hooks';
import axios from 'axios';
import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Button,
    useToast,
    Box,
    Text,
    FormControl,
    Input,
    Spinner,
    useColorModeValue,
    useColorMode,
    Checkbox,
    InputGroup,
    InputLeftAddon,
    CheckboxGroup,
} from '@chakra-ui/react';
import UserBadgeItem from '../User/UserBadgeItem';
import UserListItem from '../User/UserListItem';

const UpdateChatModal = () => {
    const {
        user,
        selectedChat,
        setSelectedChat,
        fetchChats,
        setFetchChats,
        toast
    } = ChatState();
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [ search, setSearch ] = useState( "" );
    const [ searchResult, setSearchResult ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const [ groupChatName, setGroupChatName ] = useState( selectedChat ? selectedChat.chatName : '' );
    const [ renameLoading, setRenameLoading ] = useState( false );

    console.log( "selectedChat = ", selectedChat );
    const handleSearch = async ( query ) => {
        // Search for viable users to invite to a group chat.
        setSearch( query );
        if ( !query ) {
            return;
        }

        try {
            setLoading( true );
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            const response = await axios.get( `/api/user?search=${ search }`, config );

            let data = response.data.data;

            setLoading( false );
            setSearchResult( data );
        } catch ( error ) {
            toast( {
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                position: "bottom-left",
            } );
        } finally {
            setLoading( false );
        }
    };

    const handleAddUser = async ( newUser ) => {
        // Check if user is already in group
        if ( selectedChat.users.find( ( u ) => u._id === newUser._id ) ) {
            toast( {
                title: "User already in group!",
                status: "warning",
                position: "top",
            } );
            return;
        }

        // Check if user is admin - only admin can add users
        if ( selectedChat.groupAdmin._id !== user._id ) {
            toast( {
                title: "Only admins can add users!",
                status: "warning",
                position: "top",
            } );
            return;
        }

        let response;

        try {
            setLoading( true );
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            response = await axios.put(
                `/api/chat/add`,
                {
                    chatId: selectedChat._id,
                    userId: newUser._id
                },
                config
            );

            let updatedChat = response.data.data;

            // Replace selected chat's data
            setSelectedChat( updatedChat );

            // Remove current iteration of this chat from chats list, and add the new one. 
            setFetchChats( true );
            setLoading( false );

            toast( {
                title: "Successfully added user to chat",
                // description: response.data.message,
                status: "success",
                position: "bottom",
            } );
        } catch ( error ) {
            toast( {
                title: "Failed to add user to chat",
                description: error.response.data.message,
                status: "error",
                position: "bottom",
            } );
        } finally {
            setLoading( false );
        }
    }

    const handleRemove = async ( delUser ) => {
        // Check if user is admin - only admin can add users
        if ( selectedChat.groupAdmin._id !== user._id && delUser._id !== user._id ) {
            toast( {
                title: "Only admins can remove users!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            } );
            return;
        }

        let response;

        try {
            setLoading( true );
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            response = await axios.put(
                `/api/chat/remove`,
                {
                    chatId: selectedChat._id,
                    userId: delUser._id
                },
                config
            );

            let updatedChat = response.data.data;

            // If this user was removed, then block the chat from view. Else, update the chat details. 
            delUser._id === user._id ? setSelectedChat() : setSelectedChat( updatedChat );

            // Remove current iteration of this chat from chats list, and add the new one. 
            setFetchChats( true );
            setLoading( false );

            toast( {
                title: "Successfully removed user from chat",
                description: response.data.message,
                status: "success",
                position: "bottom",
            } );
        } catch ( error ) {
            toast( {
                title: "Failed to remove user from chat",
                description: error.response.data.message,
                status: "error",
                position: "bottom",
            } );
        } finally {
            setLoading( false );
        }
    };

    const handleRename = async () => {
        // Rename chat
        if ( !groupChatName ) {
            toast( {
                title: "You must provide a name",
                status: "warning",
                position: "top",
            } );
            return;
        }

        let response;

        try {
            setRenameLoading( true );
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            response = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName
                },
                config
            );

            let updatedChat = response.data.data;

            // Replace selected chat's data
            setSelectedChat( updatedChat );

            // Remove current iteration of this chat from chats list, and add the new one. 
            setFetchChats( true );
            setRenameLoading( false );

            /**
            toast( {
                title: "Successfully renamed chat.",
                // description: response.data.message,
                status: "success",
                position: "bottom",
            } );
            */
        } catch ( error ) {
            toast( {
                title: "Failed to rename chat!",
                description: error.message,
                status: "error",
                position: "bottom",
            } );
        } finally {
            setRenameLoading( false );
            setGroupChatName( "" );
        }
    }


    const handleChange = async ( value, value_id ) => {

        let response;
        let body = {
            chatId: selectedChat._id,
            value: value,
            value_id: value_id
        };
        // body[ value_id ] = value;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            response = await axios.put(
                `/api/chat/update`,
                body,
                config
            );

            let updatedChat = response.data.data;

            // Replace selected chat's data
            // setSelectedChat( updatedChat );

            // Remove current iteration of this chat from chats list, and add the new one. 
            setFetchChats( true );

        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( msg );
        }
    }

    return (
        selectedChat ? (
            <>
                <IconButton
                    display={ { base: 'flex' } }
                    size={ "sm" }
                    icon={ <ViewIcon /> }
                    onClick={ onOpen }
                    bg={ '#00000000' }
                />

                <Modal isOpen={ isOpen } onClose={ onClose }>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader
                            fontSize={ '35px' }
                            fontFamily={ "Work sans" }
                            display={ 'flex' }
                            justifyContent={ 'center' }
                            bg={ useColorModeValue(
                                'gray.light',
                                'gray.dark'
                            ) }
                        >
                            { selectedChat.chatName }
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody

                            bg={ useColorModeValue(
                                'gray.light',
                                'gray.dark'
                            ) }
                        >

                            <Box w="100%" d="flex" flexWrap="wrap">
                                <Text>Users: </Text>
                                { selectedChat.users.map( ( u ) => (
                                    <UserBadgeItem
                                        isUser={ u._id === user._id }
                                        key={ u._id }
                                        userData={ u }
                                        handleFunction={ () => handleRemove( u ) }
                                    />
                                ) ) }
                            </Box>

                            { /* Rename controls */ }
                            <FormControl id={ 'chatName' } display={ 'flex' }>
                                <Input placeholder='Chat Name' mb={ 3 }
                                    defaultValue={ selectedChat.chatName }
                                    size={ 'xs' }
                                    value={ groupChatName }
                                    onChange={ ( e ) => setGroupChatName( e.target.value ) } />
                                <Button
                                    variant="solid"
                                    isLoading={ renameLoading }
                                    colorScheme='teal'
                                    size={ 'xs' }
                                    ml={ 1 }
                                    onClick={ handleRename }>Save</Button>
                            </FormControl>

                            <FormControl id={ 'search' }>
                                <Input
                                    placeholder="Add User to group"
                                    size={ 'xs' }
                                    mb={ 1 }
                                    onChange={ ( e ) => handleSearch( e.target.value ) }
                                />
                            </FormControl>

                            <FormControl id={ 'public' }>
                                <InputGroup
                                    border={ '1px' }
                                    borderColor={ 'blackAlpha.300' }
                                    size={ 'xs' }
                                >
                                    <InputLeftAddon
                                        width={ '5rem' }
                                    >Set Public</InputLeftAddon>
                                    <CheckboxGroup
                                        defaultValue={ [
                                            selectedChat?.isPublicChat ? 'public' : undefined
                                        ] }
                                    >
                                        <Checkbox
                                            value={ 'public' }
                                            size={ 'lg' }
                                            px={ 2 }
                                            // isChecked={ selectedChat?.isPublicChat }
                                            onChange={ ( e ) => handleChange(
                                                e.target.checked,
                                                "isPublicChat"
                                            ) }
                                        />
                                    </CheckboxGroup>
                                </InputGroup>
                            </FormControl>

                            { loading ? (
                                <Spinner size="lg" />
                            ) : (
                                searchResult?.map( ( u ) => (
                                    <UserListItem
                                        key={ u._id }
                                        user={ u }
                                        handleFunction={ () => handleAddUser( u ) }
                                    />
                                ) )
                            ) }
                        </ModalBody>

                        <ModalFooter

                            bg={ useColorModeValue(
                                'gray.light',
                                'gray.dark'
                            ) }
                        >
                            <Button
                                colorScheme='blue'
                                mr={ 3 }
                                onClick={ onClose }
                                size={ 'xs' }
                            >
                                Close
                            </Button>
                            <Button
                                onClick={ () => { handleRemove( user ) } }
                                size={ 'xs' }
                                colorScheme={ 'red' }
                            >
                                Leave Group
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </> )
            :
            ( <>X</> )
    );
}

export default UpdateChatModal;
