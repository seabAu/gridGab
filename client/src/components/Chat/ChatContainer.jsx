import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import ChatContent from './ChatContent';

const ChatContainer = ( { refresh, setRefresh } ) => {
    const { selectedChat } = ChatState();
    return (

        <Box
            className="chat-container"
            display={ { base: selectedChat ? "flex" : "none", md: "flex" } }
            alignItems="center"
            flexDir="column"
            w={ { base: "100%", md: "68%" } }
            borderRadius="sm"
            borderWidth="1px"
            borderColor={
                useColorModeValue(
                    'blackAlpha.100',
                    'whiteAlpha.100'
                )
            }
        >
            <ChatContent headerHeight={`48px`} />
        </Box>
    )
}

export default ChatContainer;
