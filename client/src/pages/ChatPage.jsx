import {
    useEffect,
    useState,
} from 'preact/hooks';
import React from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import ChatList from '../components/Chat/ChatList';
import ChatContent from '../components/Chat/ChatContent';
import SideDrawer from '../components/Page/SideDrawer';
import {
    Box,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import ChatContainer from '../components/Chat/ChatContainer';

const ChatPage = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { user, refresh, setRefresh } = ChatState();
    // const [ refresh, setRefresh ] = useState( false );

    // const fetchChats = async () => {
    //     const {data} = await axios.get( '/api/chat' );
    //     // console.log( "Data retrieved for chats: ", data );
    //     setChats( data );
    // }

    useEffect( () => { }, [] );

    console.log(
        'ChatPage :: user is = ',
        user
    );

    return (
        <div
            style={ { width: '100%' } }
            bg={ useColorModeValue(
                'white',
                'gray.dark'
            ) }>
            { user && <SideDrawer /> }

            <Box
                display='flex'
                justifyContent='space-between'
                w='100%'
                h='91.5vh'
                p='4px'>
                {user && <ChatList refresh={refresh} />}
                {user && <ChatContainer refresh={refresh} setRefresh={setRefresh} />}
            </Box>
        </div>
    );
};

export default ChatPage;
