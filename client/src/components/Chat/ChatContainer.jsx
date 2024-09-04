import React from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import ChatContent from './ChatContent';

const ChatContainer = ( { refresh, setRefresh } ) => {
    const { selectedChat } = ChatState();
    return (

        <Box
            className="chat-content-panel"
            display={ { base: selectedChat ? "flex" : "none", md: "flex" } }
            alignItems="center"
            flexDir="column"
            p={ 1 }
            w={ { base: "100%", md: "68%" } }
            borderRadius="sm"
            borderWidth="1px"
        >
            <ChatContent />
        </Box>
    )
}

export default ChatContainer;
