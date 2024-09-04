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
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'preact/hooks'
import { AiOutlineSearch } from "react-icons/ai";
import { BellIcon, ChevronDownIcon, MoonIcon, SettingsIcon, SunIcon } from "@chakra-ui/icons";
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import UserListItem from '../Chat/UserListItem';
import ChatLoading from '../Chat/ChatLoading';
import axios from 'axios';
import { getSender } from '../../config/ChatLogic';

const SideDrawer = () => {
    const {
        user,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
    } = ChatState();
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    const [ search, setSearch ] = useState( "" );
    const [ searchResult, setSearchResult ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const [ loadingChat, setLoadingChat ] = useState();

    const logoutHandler = async () => {
        // Logs user out; messages server, deletes localstorage. 
        localStorage.removeItem( 'userInfo' );
        console.log( "User has been logged out." );
        // setUser( null );
        navigate( '/' );
    }

    const handleSearch = async () => {
        if ( !search ) {
            toast( {
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
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

            console.log(
                "SideDrawer",
                " :: ", "handleSearch",
                " :: ", "token = ", user.token,
                " :: ", "search = ", search,
                " :: ", "response = ", response,
                " :: ", "response.data.data = ", response.data.data
            );
            // const data = response.data;

            if ( response.data ) {
                setSearchResult( response.data.data );

                toast( {
                    title: "Found results!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-left'
                } );
            }
            setLoading( false );
        } catch ( error ) {

            toast( {
                title: "Error",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
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
                duration: 5000,
                isClosable: true,
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
                `/api/chat`,
                {
                    userId
                },
                config
            );

            console.log(
                "SideDrawer",
                " :: ", "accessChat",
                " :: ", "token = ", user.token,
                " :: ", "search = ", search,
                " :: ", "response = ", response,
                " :: ", "response.data.data = ", response.data.data
            );
            // const data = response.data;

            if ( response.data ) {
                let data = response.data.data;
                if ( chats.length > 0 ) {
                    // We are involved in at least 1 chat.
                    if ( !chats.find( ( c ) => c._id === data._id ) ) {
                        // Append this chat to our list of chats.
                        setChats( [ data, ...chats ] );
                    }
                }
                setSelectedChat( data );
            }
            setLoadingChat( false );
        } catch ( error ) {

            toast( {
                title: "Error",
                description: "Failed to load chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            } );
        } finally {
            setLoadingChat( false );
        }
    }

    useEffect( () => {
        console.log( "searchResult = ", searchResult );
    }, [ searchResult ] );

    return (
        <>
            <Box
                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                display={ 'flex' }
                flexDir={ 'row' }
                justifyContent="space-between"
                alignItems="center"
                flexWrap={'nowrap'}
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="1px"
                borderColor={ useColorModeValue( 'gray.200', 'gray.800' ) }
            >
                <Tooltip label="Search users to chat" hasArrow placement='bottom-end' >
                    <Button
                        variant="ghost"
                        bg={ useColorModeValue( 'white', 'gray.dark' ) }
                        _hover={ {
                            backgroundColor: useColorModeValue( 'gray.100', 'gray.800' ),
                            color: useColorModeValue( 'gray.800', 'gray.100' ),
                            boxShadow: '0px 0px -2px -2px inset gray'
                        } }>
                        <AiOutlineSearch />
                        <Text d={ { base: "none", md: "flex" } } px={ 4 } onClick={ onOpen }>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Box
                    bg={ useColorModeValue( 'white', 'gray.dark' ) }
                    display={ 'flex' }
                    flexDir={ 'row' }
                    paddingInline={ '4px' }
                    gap={'8px'}
                    alignItems="center"
                    w={ 'auto' }
                >
                    <img src={ '../../assets/images/LogoDark.png' } ></img>

                    <Text fontSize={ "2xl" } fontFamily={ "Work sans" } color={ useColorModeValue( 'gray.dark', 'white' ) } >
                        gridGab
                    </Text>
                </Box>
                <div>
                    <Menu>
                        <MenuButton
                            flexWrap={'nowrap'}
                            transition='all 0.2s'
                            borderRadius='md'
                            _hover={ { bg: 'gray.light' } }
                            _expanded={ { bg: 'gray.dark' } }
                            _focus={ { boxShadow: 'inset' } }
                        >
                            {
                                notifications.length ? (
                                    <Badge variant='solid' colorScheme='red'>
                                        {
                                            notifications.length
                                        }
                                    </Badge>
                                )
                                    :
                                    (
                                        <></>
                                    )
                            }
                            
                            <BellIcon fontSize={ "2xl" } m={ 1 } />

                        </MenuButton>

                        <MenuList>
                            {
                                !notifications.length
                                    ?

                                    <MenuItem key={ "no-notifications" } >
                                        <Text fontSize={ "sm" }
                                            fontFamily={ "Work sans" }
                                            color={ useColorModeValue( 'gray.dark', 'white' ) }
                                            justifyContent={ 'flex-start' }
                                            alignSelf={ 'center' }
                                            padding={ '0' }
                                            margin={ '0' }
                                        >
                                            { ( "No Notifications" ) }
                                        </Text>
                                    </MenuItem>
                                    :
                                    (
                                        notifications.map( ( notify, index ) => {
                                            return (
                                                <MenuItem
                                                    key={ notify._id }
                                                    onClick={ () => {
                                                        setSelectedChat( notify.chat );
                                                        setNotifications(
                                                            notifications.filter(
                                                                ( n ) => n !== notify
                                                            )
                                                        );
                                                    } }>
                                                    <Text
                                                        fontSize={ "sm" }
                                                        fontFamily={ "Work sans" }
                                                        color={ useColorModeValue( 'gray.dark', 'white' ) }
                                                        justifyContent={ 'flex-start' }
                                                        alignSelf={ 'center' }
                                                        padding={ '0' }
                                                        margin={ '0' }
                                                    >
                                                        { notify.chat.isGroupChat
                                                            ?
                                                            `New message in ${ notify.chat.chatName }`
                                                            :
                                                            `New message from ${ getSender( user, notify.chat.users ) }`
                                                        }
                                                    </Text>
                                                </MenuItem>
                                            )
                                        } )
                                    ) }
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton
                            bg={ useColorModeValue( 'white', 'gray.dark' ) }
                            as={ Button }
                            rightIcon={ <ChevronDownIcon /> }
                            aria-label='Options'
                            variant='outline'
                            px={ 4 }
                            py={ 2 }
                            transition='all 0.2s'
                            borderRadius='md'
                            borderWidth='1px'
                            _hover={ { bg: 'gray.light' } }
                            _expanded={ { bg: 'gray.dark' } }
                            _focus={ { boxShadow: 'inset' } }
                        >
                            <Avatar size='sm' cursor='pointer' name={ user.name } src={ user.avatar } />
                        </MenuButton>

                        <MenuList bg={ useColorModeValue( 'white', 'gray.dark' ) } >
                            <ProfileModal user={ user }>
                                <MenuItem
                                    bg={
                                        useColorModeValue( 'white', 'gray.dark' )
                                    }
                                    _hover={ {
                                        backgroundColor: 'gray.light',
                                        color: 'gray.100'
                                    } }>Profile</MenuItem>
                            </ProfileModal>

                            <MenuItem
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>
                                <Flex
                                    flexDirection={ "row" }
                                    flex={ 1 }
                                    alignItems={ "center" }
                                    justifyContent={ "flex-start" }
                                    gap={ 4 }
                                    w={ "full" } onClick={ toggleColorMode }>

                                    { colorMode === 'light'
                                        ? <MoonIcon />
                                        : <SunIcon /> } { `${ colorMode === 'light' ? 'Dark' : 'Light' } Mode` }

                                </Flex>
                            </MenuItem>

                            <MenuItem
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>Friend List</MenuItem>
                            <MenuItem
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>Notifications</MenuItem>
                            <MenuDivider />
                            <MenuItem
                                onClick={ logoutHandler }
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>


            <Drawer placement="left" onClose={ onClose } isOpen={ isOpen }>
                <DrawerOverlay onClick={ onClose } />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={ 2 } flexDir={ 'row' } justifyContent={ 'space-between' }>
                            <Input
                                placeholder="Search by name or email"
                                mr={ 2 }
                                value={ search }
                                onChange={ ( e ) => setSearch( e.target.value ) }
                            />
                            <Button onClick={ handleSearch }>Go</Button>
                        </Box>

                        Results
                        { loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map( ( u ) => (
                                <UserListItem
                                    key={ u._id }
                                    user={ u }
                                    handleFunction={ () => accessChat( u._id ) }
                                />
                            ) )
                        ) }
                        { loadingChat && <Spinner ml="auto" d="flex" /> }
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant='outline' mr={ 3 } onClick={ onClose }>
                            Close
                        </Button>
                        <Button colorScheme='blue'>+</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
