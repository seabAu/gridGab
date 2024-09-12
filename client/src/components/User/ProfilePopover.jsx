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
    useColorModeValue,
} from '@chakra-ui/react';
import * as util from 'akashatools';
import ProfileModal from './ProfileModal';
import ProfileInfo from './ProfileInfo';

const ProfilePopover = ( props ) => {

    const { colorMode, toggleColorMode } = useColorMode();
    const {
        children,
        userData, // User we want to display; Use different name from the logged in user to compare visible options / info. 
        size = 'sm',
        mw = `${ 1.0 }rem`,
    } = props;

    return (
        userData && (
            <Popover>
                <PopoverTrigger>
                    { children }
                </PopoverTrigger>
                <PopoverContent
                    color='white'
                    bg={ useColorModeValue( 'gray.light', 'gray.dark' ) }
                >
                    <PopoverCloseButton bg='purple.500' />
                    <PopoverBody>
                        <ProfileInfo userData={ userData } />
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        )
    )
}

export default ProfilePopover
