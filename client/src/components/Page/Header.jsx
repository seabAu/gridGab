import React from 'react'
import {
    Box,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
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
