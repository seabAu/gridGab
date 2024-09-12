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
    useToast,
    Input,
    Spinner,
    Badge,
    Image,
    FormControl,
    MenuGroup,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'preact/hooks'
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
import Logo from './Logo';
import Nav from './Nav';

const Header = ( props ) => {
    const {
        children,
        headerHeight,
        debug,
    } = props;

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
        <Box
            bg={ useColorModeValue( 'white', 'gray.dark' ) }
            display={ 'flex' }
            flexDir={ 'row' }
            justifyContent="space-between"
            alignItems="center"
            flexWrap={ 'nowrap' }
            w="100%"
            // p="5px 10px 5px 10px"
            borderWidth="1px"
            borderColor={ useColorModeValue( 'gray.200', 'gray.800' ) }
            h={ `${ 48.0 }px` }
        >
            <Logo />

            <Nav />
            {
                // End of HEADER
            }
        </Box>

    )
}

export default Header
