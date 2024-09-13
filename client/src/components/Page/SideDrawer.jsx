import React from 'react'
import {
    Avatar,
    Box,
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    useToast,
    Input,
    Spinner,
    DrawerFooter,
    DrawerCloseButton,
    Badge,
    Image,
    FormControl,
    MenuGroup,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'preact/hooks'
import { ChatState } from '../../context/ChatProvider';

import {
    AiFillPicture,
    AiOutlineAccountBook,
    AiOutlineBell, 
    AiOutlineLogout, 
    AiOutlineSearch, 
    AiOutlineSetting, 
    AiOutlineSmile
} from "react-icons/ai";

import ProfileModal from '../User/ProfileModal';
import UserListItem from '../User/UserListItem';
import ChatLoading from '../Chat/ChatLoading';
import axios from 'axios';
import { getSender } from '../../config/ChatLogic';
import logoDark from "../../assets/images/LogoDark.png";
import logoLight from "../../assets/images/LogoLight.png";
import UpdateProfileModal from '../User/UpdateProfileModal';


const SideDrawer = ( props ) => {
    const {
        open,
        setOpen,
        width,
        placement,
        children,   // Child elements will be placed in the side drawer's body content area. 
        debug,
    } = props;

    const {
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        openSearchDrawer,
        setOpenSearchDrawer,
        toast, 
    } = ChatState();

    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialFocus = useRef();
    const [ search, setSearch ] = useState( "" );
    const [ searchResult, setSearchResult ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const [ loadingChat, setLoadingChat ] = useState();

    const handleSearch = async () => {
        if ( !search ) {
            toast( {
                title: "Please enter something in search",
                status: "warning",
                position: 'top-left'
            } );
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

            if ( response.data ) {
                setSearchResult( response.data.data );

                toast( {
                    title: "Found results!",
                    status: "success",
                    position: 'top-left'
                } );
            }
            setLoading( false );
        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( error );
            toast( {
                title: "Error: Failed to load the search results: ",
                description: msg,
                status: "error",
                position: 'bottom-left'
            } );
        } finally {
            setLoading( false );
        }
    }

    const accessChat = async ( userId ) => {
        if ( !userId ) {
            toast( {
                title: "Please select a user.",
                status: "warning",
                position: 'top-left'
            } );
            return;
        }

        try {
            setLoadingChat( true );

            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                    "Content-type": "application/json"
                },
            };

            const response = await axios.post(
                `/api/chat`, {
                    userId
                },
                config
            );

            if ( response.data ) {
                let data = response.data.data;
                if ( chats?.length > 0 ) {
                    // We are involved in at least 1 chat.
                    if ( !chats?.find( ( c ) => c._id === data._id ) ) {
                        // Append this chat to our list of chats.
                        setChats( [ data, ...chats ] );
                    }
                }
                setSelectedChat( data );
            }
            setLoadingChat( false );
        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( error );
            toast( {
                title: "Error",
                description: msg,
                status: "error",
                position: 'bottom-left'
            } );
        } finally {
            setLoadingChat( false );
        }
    }

    useEffect( () => {
        console.log( "searchResult = ", searchResult );
    }, [ searchResult ] );

    useEffect(() => {
        if ( openSearchDrawer ) {
            // Open drawer
            if ( !isOpen ) onOpen();
        }
        else {
            // Close drawer
            if ( isOpen ) onClose();
        }
        
    }, [ openSearchDrawer ]);

    useEffect(() => {
        if ( isOpen && !openSearchDrawer ) {
            // Drawer is open, but our state variable is mismatched.
            onOpen();
        }
        else if ( !isOpen && openSearchDrawer ) {
            // Drawer is closed, but our state variable is mismatched.
            onClose();
        }
        
    }, [ isOpen ]);

    return (

        <Drawer
            initialFocusRef={ initialFocus }
            placement={ "left" }
            onClose={ onClose }
            isOpen={ isOpen }
        >
            <DrawerOverlay />
            <DrawerContent
                bg={ useColorModeValue(
                    'gray.light',
                    'gray.dark'
                ) }
            >
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                    <FormControl
                        // ref={ initialFocus }
                        display="flex"
                        pb={ 2 }
                        flexDir={ 'row' }
                        justifyContent={ 'space-between' }
                        onKeyDown={ ( e ) => {
                            if ( e.key === "Enter" && search ) {
                                handleSearch();
                            }
                        } }
                    >

                        <Input
                            ref={ initialFocus }
                            id={ 'search' }
                            placeholder={ "Search by name or email" }
                            mr={ 2 }
                            value={ search }
                            onChange={ ( e ) => setSearch( e.target.value ) }
                        />
                        <Button onClick={ handleSearch }>Go</Button>
                    </FormControl>

                    Results
                    { loading ? (
                        <ChatLoading />
                    ) : (
                        searchResult?.map( ( u ) => (
                            <UserListItem
                                key={ u._id }
                                userData={ u }
                                handleFunction={ () => accessChat( u._id ) }
                            />
                        ) )
                    ) }
                    { loadingChat && <Spinner ml="auto" d="flex" /> }
                </DrawerBody>
                <DrawerFooter>
                    <Button
                        variant='outline'
                        size={ 'sm' }
                        mr={ 3 }
                        onClick={ () => {
                            onClose();
                            setOpenSearchDrawer( false );
                        } }
                    >
                        Close
                    </Button>
                    <Button
                        variant='outline'
                        size={ 'sm' }
                    >
                        +
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default SideDrawer
