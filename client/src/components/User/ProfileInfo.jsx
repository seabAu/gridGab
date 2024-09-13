// Mini display view of a user's profile visible when mousing over a user's avatar or UserBadgeItem or UserListItem elements.
import React from 'react'
import {
    useColorModeValue,
    useColorMode,
    Box,
    Avatar,
    Image,
    Text,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    SimpleGrid,
    List,
    ListItem,
    Button,
    Stack,
    Code,
    Tag,
} from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import * as util from 'akashatools';
import ProfileModal from './ProfileModal';

const ProfileInfo = ( props ) => {
    const {
        userData,
        size,
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
        <Box
            // Overall content container
            bg={ useColorModeValue(
                'gray.100',
                'gray.dark'
            ) }
            display={ "flex" }
            flexDir={ "column" }
            w={ '100%' }
            h={ '100%' }
        >
            <Box
                // Top Panels
                display={ 'flex' }
                flexDir={ 'row' }
                flexGrow={ 1 }
                px={ `${ 0.5 }em` }
                w={ '100%' }
                h={ '100%' }
            >

                <Box
                    // Left Side Top Panel
                    display={ 'flex' }
                    flexDir={ 'column' }
                    // border={ '1px' }
                    alignItems={ 'start' }
                    alignContent={ 'flex-start' }
                    alignSelf={ 'start' }
                    justifyContent={ 'flex-start' }
                    flexGrow={ 0 }
                    px={ `${ 0.5 }em` }
                >
                    <Avatar
                        borderRadius="full"
                        boxSize="96px"
                        ratio={ 2 }
                        src={ userData ? userData.avatar : '' }
                        alt={ userData ? userData.name : '' }
                    />

                    <ProfileModal userData={ userData }>
                        <Button
                            size={ 'xs' }
                            width="100%"
                            style={ { marginTop: 15 } }
                        >
                            Open Profile
                        </Button>
                    </ProfileModal>
                </Box>

                <Box
                    // Right Side Top Panel
                    display={ 'flex' }
                    flexDir={ 'column' }
                    alignItems={ 'start' }
                    justifyContent={ 'space-between' }
                    flexGrow={ 0 }
                    px={ `${ 0.5 }em` }
                    minW={ '25%' }
                    w={ '100%' }
                    h={ '100%' }
                // border={ '1px' }
                >
                    {
                        userData && userData?.display_name && (
                            <Box
                                mr={ 2 }
                                display={ 'flex' }
                            >
                                <Text
                                    as={ 'b' }
                                    size={ 'lg' }
                                    fontSize={ 'md' }
                                >{ userData.display_name }</Text>
                            </Box>
                        )
                    }

                    {
                        userData && userData?.name && (
                            <Box
                                mr={ 2 }
                                display={ 'flex' }
                            >
                                <Text
                                    as={ 'b' }
                                    size={ 'lg' }
                                    fontSize={ 'md' }
                                    style={ {
                                        fontFamily: 'calibri',
                                        fontSize: `0.75em`,
                                        padding: `0px`,
                                        color: `grey`,
                                    } }
                                >{ userData.name }</Text>
                            </Box>
                        )
                    }

                    {
                        userData && userData?.register_date && (
                            <Box
                                display={ 'block' }
                                wordBreak={ 'keep-all' }
                                overflowWrap={ 'normal' }
                            >
                                <Text
                                    style={ {
                                        fontFamily: 'calibri',
                                        fontSize: `0.75em`,
                                        padding: `0px`,
                                        color: `darkslategrey`,
                                    } }
                                >Joined { util.time.convertDate( new Date( userData.register_date ) ) }</Text>
                            </Box>
                        )
                    }

                    {
                        userData && userData?.name && (
                            <Box
                                mr={ 2 }
                                display={ 'flex' }
                            >
                                <Text
                                    style={ {
                                        fontFamily: 'calibri',
                                        fontSize: `0.75em`,
                                        padding: `0px`,
                                        color: `grey`,
                                    } }
                                >{ `You ${ user.friends.includes( userData._id ) ? 'are' : 'are not' } friends` }</Text>
                            </Box>
                        )
                    }

                </Box>


            </Box>

            <Box
                gap={ '2rem' }
            // Bottom panels
            >

                {
                    userData && userData?.about && (
                        <Box
                            display={ 'flex' }
                            style={ {
                                fontFamily: 'calibri',
                                marginTop: `16px`,
                                padding: 4,
                                borderWidth: `1px`,
                                borderRadius: `12px`,
                                overflowX: `auto`,
                                position: 'relative',
                            } }
                        >
                            <Text
                                style={ {
                                    fontFamily: 'calibri',
                                    marginTop: `-22px`,
                                    marginLeft: `8px`,
                                    padding: `0px`,
                                    overflowX: `auto`,
                                    position: `fixed`,
                                    color: `darkslategrey`,
                                    fontSize: `0.875em`,
                                } }
                            >
                                About
                            </Text>
                            <Text noOfLines={ [ 1, 2, 3 ] }>{ userData.about }</Text>
                        </Box>
                    )
                }

                {
                    userData && userData?.status && (
                        <Box
                            display={ 'flex' }
                            style={ {
                                fontFamily: 'calibri',
                                marginTop: `16px`,
                                padding: 4,
                                borderWidth: `1px`,
                                borderRadius: `12px`,
                                overflowX: `auto`,
                                position: 'relative',
                            } }
                        >
                            <Text
                                style={ {
                                    fontFamily: 'calibri',
                                    marginTop: `-22px`,
                                    marginLeft: `8px`,
                                    padding: `0px`,
                                    overflowX: `auto`,
                                    position: `fixed`,
                                    color: `darkslategrey`,
                                    fontSize: `0.875em`,
                                } }
                            >
                                Status
                            </Text>
                            <Text noOfLines={ [ 1, 2, 3 ] }>{ userData.status }</Text>
                        </Box>
                    )
                }

            </Box>
        </Box>
    )
}

export default ProfileInfo
