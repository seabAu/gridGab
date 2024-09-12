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
import Nav from './Nav';

const Logo = () => {

    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            {
                // LOGO
            }
            <Box
                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                display={ 'flex' }
                flexDir={ 'row' }
                paddingInline={ '4px' }
                gap={ '8px' }
                alignItems="center"
                w={ 'auto' }
            >
                <Image
                    cursor={ "pointer" }
                    alt='logo'
                    w={ `${ 48 }px` }
                    src={ colorMode === 'dark'
                        ? logoLight
                        : logoDark }
                ></Image>

                <Text
                    fontSize={ "2xl" }
                    fontFamily={ "Work sans" }
                    color={ useColorModeValue( 'gray.dark', 'white' ) }
                    display={ {
                        base: "none",
                        md: "flex"
                    } }
                >
                    gridGab
                </Text>
            </Box>

        </>
    )
}

export default Logo
