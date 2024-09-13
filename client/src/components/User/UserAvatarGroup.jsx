import React from 'react';
import { ChatState } from '../../context/ChatProvider';
import {
    AvatarGroup,
    useColorMode,
} from '@chakra-ui/react';
import * as util from 'akashatools';

// Socket.io import and setup.
import UserAvatar from '../User/UserAvatar';

const UserAvatarGroup = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        util.val.isValidArray( selectedChat.users, true ) && (
            <AvatarGroup size={ 'sm' } max={ 2 } p={ 1 }>
                {
                    // Map out each avatar icon. 
                    selectedChat.users.map( ( u ) => {
                        return (
                            <UserAvatar userData={ u } />
                        );
                    } )
                }
            </AvatarGroup>
        )
    )
}

export default UserAvatarGroup
