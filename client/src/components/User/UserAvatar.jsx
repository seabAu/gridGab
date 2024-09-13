// Modular component for user avatar icon with a tooltip dropdown showing their profile info in a miniature view. 

import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import {
    Avatar,
    Tooltip,
    useColorMode,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    AvatarBadge,
    useColorModeValue,
} from '@chakra-ui/react';
import * as util from 'akashatools';
import ProfileInfo from './ProfileInfo';
import ProfileModal from './ProfileModal';
import ProfilePopover from './ProfilePopover';

const UserAvatar = ( props ) => {
    const {
        userData, // User we want to display; Use different name from the logged in user to compare visible options / info. 
        showOnline = false,
        size = 'sm',
        mw = `${ 1.0 }rem`,
    } = props;

    const {
        user,
        selectedChat,
        setSelectedChat,
        fetchChats,
        setFetchChats
    } = ChatState();
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <ProfilePopover userData={ userData }>
            <Avatar
                mr={ 2 }
                maxWidth={ '64px' }
                ratio={ 1 }
                size={ size }
                cursor={ "pointer" }
                name={ userData.name }
                src={ userData.avatar }
                border={ '2px' }
                borderColor={ 'white' }
                bg={ useColorModeValue(
                    'gray.light',
                    'gray.dark'
                ) }
            >
                {
                    // showOnline && (
                    //     <AvatarBadge
                    //         borderColor='papayawhip'
                    //         bg='tomato'
                    //         boxSize='1.25em'
                    //     />
                    // )
                }

            </Avatar>
        </ProfilePopover>
        /*
        <ProfileModal userData={ userData }>
            <Tooltip
                label={ <ProfileInfo userData={ userData } /> }
                placement={ "bottom-start" }
                hasArrow
                openDelay={ 500 }
            >
                <Avatar
                    mr={ 2 }
                    maxWidth={ '50px' }
                    size={ size }
                    cursor={ "pointer" }
                    name={ userData.name }
                    src={ userData.avatar }
                // onClick={}
                />
            </Tooltip>
        </ProfileModal>
        */
    )
}

export default UserAvatar
