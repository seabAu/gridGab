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
import SideDrawer from './SideDrawer';
import Header from './Header';

const Content = ( props ) => {
    const {
        children,
        headerHeight,
        footerHeight,
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
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
            <Header />
            <SideDrawer
                open={ openSearchDrawer }
                width={ `${ 25 }%` }
                placement={ 'left' }
            />
        </>
    )
}

export default Content
