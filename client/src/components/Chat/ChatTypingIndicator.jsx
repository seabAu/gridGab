import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react'

const ChatTypingIndicator = ( props ) => {
    const {
        show = false,
        children
    } = props;

    return (
        show ?
            (
                <Box
                    display="flex"
                    flexDir="row"
                    justifyContent="flex-end"
                    p={ 3 }
                    bg={ useColorModeValue( 'gray.200', 'gray.dark' ) }
                    w="100%"
                    // h="1rem"
                    zIndex={1001}
                    borderRadius="sm"
                >
                    <div>
                        { children ? children : <></> }
                    </div>
                    <span class="chat-typing-indicator">
                        <i class="a"></i>
                        <i class="b"></i>
                        <i class="c"></i>
                    </span>
                </Box>
            )
            :
            ( <></> )
    )
}

export default ChatTypingIndicator
