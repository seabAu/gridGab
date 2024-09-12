import React from 'react'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom';
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
    useToast,
    Input,
    Spinner,
    Badge,
    Image,
    FormControl,
    MenuGroup,
} from '@chakra-ui/react';

import {
    AiFillPicture,
    AiOutlineAccountBook,
    AiOutlineBell,
    AiOutlineLogout,
    AiOutlineSearch,
    AiOutlineSetting,
    AiOutlineSmile
} from "react-icons/ai";
import {
    BellIcon,
    ChevronDownIcon,
    MoonIcon,
    SettingsIcon,
    SunIcon
} from "@chakra-ui/icons";
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from '../User/ProfileModal';
import UserListItem from '../User/UserListItem';
import ChatLoading from '../Chat/ChatLoading';
import axios from 'axios';
import { getSender } from '../../config/ChatLogic';

import logoDark from "../../assets/images/LogoDark.png";
import logoLight from "../../assets/images/LogoLight.png";
import UpdateProfileModal from '../User/UpdateProfileModal';

const Nav = () => {
    
    const {
        user,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
        openSearchDrawer,
        setOpenSearchDrawer,
    } = ChatState();
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        // Logs user out; messages server, deletes localstorage. 
        localStorage.removeItem( 'userInfo' );
        console.log( "User has been logged out." );
        // setUser( null );
        navigate( '/' );
    }
    
    return (
        <>

            {
                // NAV CONTENT
            }
            <Box>

                {
                    // NOTIFICATIONS DROPDOWN
                }
                <Menu>
                    <MenuButton
                        flexWrap={ 'nowrap' }
                        transition='all 0.2s'
                        borderRadius='md'
                        _hover={ { bg: 'gray.light' } }
                        _expanded={ { bg: 'gray.dark' } }
                        _focus={ { boxShadow: 'inset' } }
                        mx={ '0.5em' }
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

                {
                    // USER DROPDOWN
                }
                <Menu
                    variant={ 'unstyled' }
                    size={ 'xs' }
                    gutter={ 2 }
                    isLazy
                >
                    <MenuButton
                        bg={ useColorModeValue( 'white', 'gray.dark' ) }
                        as={ Button }
                        rightIcon={ <ChevronDownIcon /> }
                        aria-label='Options'
                        variant='outline'
                        px={ 2 }
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

                        <MenuGroup>

                            <UpdateProfileModal userData={ user }>
                                <MenuItem
                                    gap={ 2 }
                                    bg={
                                        useColorModeValue( 'white', 'gray.dark' )
                                    }
                                    _hover={ {
                                        backgroundColor: 'gray.light',
                                        color: 'gray.100'
                                    } }>
                                    <AiOutlineSetting />
                                    <Text>
                                        Profile
                                    </Text>
                                </MenuItem>
                            </UpdateProfileModal>

                            <UpdateProfileModal userData={ user } initialTab={ 1 }>
                                <MenuItem
                                    gap={ 2 }
                                    bg={
                                        useColorModeValue( 'white', 'gray.dark' )
                                    }
                                    _hover={ {
                                        backgroundColor: 'gray.light',
                                        color: 'gray.100'
                                    } }>
                                    <AiOutlineSmile />
                                    <Text>
                                        Friend List
                                    </Text>
                                </MenuItem>
                            </UpdateProfileModal>

                            <MenuItem
                                onClick={ ( e ) => { setOpenSearchDrawer( !openSearchDrawer ); } }
                                gap={ 2 }
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>

                                <AiOutlineSearch />
                                <Text
                                    display={ { base: "none", md: "flex" } }

                                >
                                    Search Users
                                </Text>

                            </MenuItem>

                            <MenuItem
                                gap={ 2 }
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>
                                <AiOutlineBell />
                                <Text>
                                    Notifications
                                </Text>
                            </MenuItem>

                        </MenuGroup>

                        <MenuDivider />

                        <MenuGroup>

                            <MenuItem
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>
                                <flexDir
                                    onClick={ toggleColorMode }>
                                    <Text
                                        flex={ 1 }
                                        display={ 'flex' }
                                        flexDirection={ "row" }
                                        alignItems={ "center" }
                                        justifyContent={ 'flex-start' }
                                        gap={ 2 }
                                        w={ "full" }>
                                        { colorMode === 'light'
                                            ? <MoonIcon />
                                            : <SunIcon /> } { `${ colorMode === 'light' ? 'Dark' : 'Light' } Mode` }
                                    </Text>
                                </flexDir>
                            </MenuItem>

                            <MenuItem
                                gap={ 2 }
                                onClick={ logoutHandler }
                                bg={
                                    useColorModeValue( 'white', 'gray.dark' )
                                }
                                _hover={ {
                                    backgroundColor: 'gray.light',
                                    color: 'gray.100'
                                } }>
                                <AiOutlineLogout />
                                <Text>
                                    Log Out
                                </Text>
                            </MenuItem>

                        </MenuGroup>

                    </MenuList>
                </Menu>
            </Box>

        </>
    )
}

export default Nav
