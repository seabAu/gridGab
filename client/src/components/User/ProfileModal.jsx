// Component for viewing full info for any user's profile, not just your own.
// If this component is called to view a user's OWN info, then a few extra data bits will appear, as well as some controls,
// such as update, private, friends list, and delete. 

import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Image,
    Text,
    IconButton,
    Box,
    useColorModeValue,
    useColorMode,
    useToast,
    Avatar,
} from '@chakra-ui/react'
import { useRef, useState } from 'preact/hooks';
import { ViewIcon } from '@chakra-ui/icons';
import * as util from 'akashatools';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';

const ProfileModal = ( props ) => {
    const {
        userData,
        showHeader = false,
        showfooter = true,
        children,
        forceClose
    } = props;

    const {
        user,
        setUser,
        fetchUser,
        setFetchUser,
        toast,
    } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();

    const finalRef = useRef( null );
    const initialRef = useRef( null );
    const [ friendLoading, setFriendLoading ] = useState( false );

    const handleFriend = async ( friendID ) => {
        console.log( "ProfileModal :: handleFriend :: user = ", user );
        setFriendLoading( true );
        let isFriend = ( user.friends.includes( userData._id ) );
        let endpoint = `/api/user/${ friendID }/${ isFriend ? 'remove' : 'add' }`;
        let response;
        console.log( "ProfileModal :: handleFriend :: user = ", user, " :: ", "friendID = ", friendID, " :: ", "isFriend = ", isFriend, " :: " );

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                    "Content-type": "application/json",
                },
            };

            response = await axios.post(
                endpoint,
                userData,
                config
            );

            console.log( "Axios :: received: ", response.data );
            if ( response.data ) {

                const data = response.data;
                const updatedUserData = data.data;
                if ( updatedUserData ) {
                    console.log( "Saving setUser( updatedUserData ) :: ", updatedUserData );

                    // setUser( updatedUserData );
                }
            }
            toast( {
                title: response.data.message ? response.data.message : "Update Successful",
                status: "success",
            } );

            setFriendLoading( false );

            // Tell the state handler to fetch this user's profile after the change was made. 
            setFetchUser( true );
            // localStorage.setItem( "userInfo", JSON.stringify( updatedUserData ) );

        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( msg );
            toast( {
                title: "An error occurred",
                description: msg,
                status: "error",
            } );
            setFriendLoading( false );

            // If status code for invalid input data, try to re-fetch the user data to fix most potential causes for it. Usually just the local user data lagging behind server copy.
            let status = error.response?.status;
            if ( status === 422 || status === 402 ) {
                setFetchUser( true );
            }
        } finally {
            // Lastly, reset values. 
            setFriendLoading( false );
        }
    }

    const handleSubmit = async () => {
        setLoading( true );
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                    "Content-type": "application/json",
                },
            };

            const response = await axios.post(
                "/api/user/profile",
                userData,
                config
            );
            const data = response.data;
            const updatedUserData = data.user;
            console.log( "Axios :: received: ", data );
            toast( {
                title: response.data.message ? response.data.message : "Update Successful",
                status: "success",
            } );
            localStorage.setItem( "userInfo", JSON.stringify( updatedUserData ) );
            setUser( updatedUserData );
            setUserData( updatedUserData );
            setLoading( false );
            // navigate( "/chat" );
        } catch ( error ) {
            toast( {
                title: "An error occurred!",
                description: error.message,
                status: "error",
            } );
            setLoading( false );
        } finally {
            // Lastly, reset values. 
            setFriendLoading( false );
        }
    }

    return (
        <>
            { children ? (
                <span onClick={ onOpen }>{ children }</span>
            ) : (
                <IconButton d={ { base: "flex" } } icon={ <ViewIcon /> } onClick={ onOpen } />
            ) }
            <Modal
                isCentered
                // blockScrollOnMount={ false }
                isOpen={ isOpen }
                onClose={ onClose }
                // motionPreset='slideInBottom'
                size={ 'lg' }
                scrollBehavior={ 'inside' }
                initialFocusRef={ initialRef }
                finalFocusRef={ finalRef }
                bg={ useColorModeValue(
                    'gray.100',
                    'gray.dark'
                ) }
            >
                <ModalOverlay
                    // bg='blackAlpha.300'
                    // backdropFilter='blur(10px) hue-rotate(90deg)'
                    // backdropFilter='auto'
                    // backdropInvert='80%'
                    // backdropBlur='2px'
                    onClick={ onClose }
                />
                <ModalContent
                    h="410px"
                    w={ 'auto' }
                    maxW={ `${ 480 }px` }
                    py={ 1 }
                    // bg={ useColorModeValue(
                    //     'gray.100',
                    //     'gray.800'
                    // ) }
                    bg={ useColorModeValue(
                        'whiteAlpha.400',
                        'gray.900'
                    ) }
                >

                    { showHeader &&
                        <ModalHeader
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent="left"
                            bg={ useColorModeValue(
                                'whiteAlpha.200',
                                'blackAlpha.200'
                            ) }
                            px={ 2 }
                            py={ 1 }
                            m={ 0 }
                        >
                            { userData ? userData.name : '' }'s Profile
                            <ModalCloseButton size={ 'sm' } />
                        </ModalHeader>
                    }

                    <ModalBody
                        display={ "flex" }
                        flexDir={ "column" }
                        alignItems={ "center" }
                        w={ '100%' }
                        h={ '100%' }
                        mt={ 2 }
                    >
                        <ModalCloseButton size={ 'sm' } />



                        <Box
                            // Overall content container
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
                                // px={ `${ 0.5 }em` }
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
                                    px={ `${ 0.5 }em` }
                                    flexGrow={ 0 }
                                >
                                    <Box
                                        // Left Side Panel
                                        display={ 'flex' }
                                        flexDir={ 'column' }
                                        // border={ '1px' }
                                        alignItems={ "center" }
                                        justifyContent={ 'center' }
                                        flexGrow={ 0 }
                                        px={ `${ 0.5 }em` }
                                        minW={ '25%' }
                                        w={ '100%' }
                                    >
                                        <Avatar
                                            borderRadius="full"
                                            boxSize="108px"
                                            src={ userData ? userData.avatar : '' }
                                            alt={ userData ? userData.name : '' }
                                        />

                                        {
                                            // If not the current user, show a add/remove-friend button. 
                                            userData && user && ( ( user?._id !== userData?._id ) ) ? (
                                                <Box>
                                                    <Button
                                                        size={ 'xs' }
                                                        onClick={ ( e ) => {
                                                            handleFriend( userData._id );
                                                        } }
                                                        width="100%"
                                                        style={ { marginTop: 15 } }
                                                        isLoading={ friendLoading }
                                                    >
                                                        {
                                                            `${ ( user?.friends?.includes( userData._id ) ) ? 'Remove' : 'Add' } Friend`
                                                        }
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <></>
                                            )
                                        }

                                    </Box>

                                </Box>

                                <Box
                                    // Right Side Top Panel
                                    display={ 'flex' }
                                    flexDir={ 'column' }
                                    alignItems={ 'start' }
                                    justifyContent={ 'flex-start' }
                                    flexGrow={ 0 }
                                    px={ `${ 0.5 }em` }
                                    maxW={ '755%' }
                                    w={ '100%' }
                                    h={ '100%' }
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
                                                >{ `You ${ user.friends.includes( userData._id ) ? 'are' : 'are not' } in any chats together` }</Text>
                                            </Box>
                                        )
                                    }

                                </Box>

                            </Box>

                            <Box
                                // Bottom panels
                                display={ 'flex' }
                                flexDir={ 'column' }
                                px={ `${ 0.5 }em` }
                                w={ '100%' }
                                h={ '100%' }
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
                                                position: 'relative',
                                            } }
                                        >
                                            <Text
                                                style={ {
                                                    fontFamily: 'calibri',
                                                    padding: `0px`,
                                                    color: `darkslategrey`,
                                                    fontSize: `0.875em`,
                                                    position: 'relative',
                                                    top: '-20px',
                                                    left: '10px',
                                                } }
                                            >
                                                About
                                            </Text>
                                            <Text
                                                style={ {
                                                    fontFamily: 'calibri',
                                                    marginLeft: `-8px`,
                                                    padding: `0px`,
                                                    fontSize: `0.875em`,
                                                } }
                                                noOfLines={ [ 1, 2, 3 ] }
                                            >
                                                { userData.about }
                                            </Text>
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
                                                position: 'relative',
                                            } }
                                        >
                                            <Text
                                                style={ {
                                                    fontFamily: 'calibri',
                                                    padding: `0px`,
                                                    color: `darkslategrey`,
                                                    fontSize: `0.875em`,
                                                    position: 'relative',
                                                    top: '-20px',
                                                    left: '10px',
                                                } }
                                            >
                                                Status
                                            </Text>
                                            <Text
                                                style={ {
                                                    fontFamily: 'calibri',
                                                    marginLeft: `-8px`,
                                                    padding: `0px`,
                                                    fontSize: `0.875em`,
                                                } }
                                                noOfLines={ [ 1, 2, 3 ] }
                                            >
                                                { userData.status }
                                            </Text>
                                        </Box>
                                    )
                                }

                            </Box>
                        </Box>
                    </ModalBody>

                    {
                        showfooter &&
                        <ModalFooter
                            p={ 1 }
                            bg={ useColorModeValue(
                                'gray.100',
                                'gray.900'
                            ) }
                        >
                                <Button onClick={ () => { onClose(); } } size={ 'sm' }>Close</Button>
                        </ModalFooter>
                    }
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProfileModal;


/*


                        <Box
                            // Overall content container
                            display={ 'flex' }
                            flexDir={ 'column' }
                            alignItems={ "center" }
                            justifyContent={ 'space-evenly' }
                        >

                            <Box
                                // Values
                                display={ 'flex' }
                                flexDir={ 'row' }
                                // border={ '1px' }
                                justifyContent={ 'space-between' }
                            >

                                <Box
                                    // Left Side Panel
                                    display={ 'flex' }
                                    flexDir={ 'column' }
                                    // border={ '1px' }
                                    alignItems={ "center" }
                                    flexGrow={ 0 }
                                    px={ `${ 0.5 }em` }
                                    minW={ '25%' }
                                    w={ '100%' }
                                >
                                    <Avatar
                                        borderRadius="full"
                                        boxSize="96px"
                                        src={ userData ? userData.avatar : '' }
                                        alt={ userData ? userData.name : '' }
                                    />

                                    {
                                        // If not the current user, show a add/remove-friend button. 
                                        userData && user && ( ( user?._id !== userData?._id ) ) ? (
                                            <Box>
                                                <Button
                                                    size={ 'xs' }
                                                    onClick={ ( e ) => {
                                                        handleFriend( userData._id );
                                                    } }
                                                    width="100%"
                                                    style={ { marginTop: 15 } }
                                                    isLoading={ friendLoading }
                                                >
                                                    {
                                                        `${ ( user?.friends?.includes( userData._id ) ) ? 'Remove' : 'Add' } Friend`
                                                    }
                                                </Button>
                                            </Box>
                                        ) : (
                                            <></>
                                        )
                                    }

                                </Box>

                                <Box
                                    // Right Side Panel
                                    display={ 'flex' }
                                    flexDir={ 'column' }
                                    // border={ '1px' }
                                    alignItems={ "left" }
                                    flexGrow={ 1 }
                                    pl={ `${ 0.5 }em` }
                                    flexWrap={ 'nowrap' }
                                    wordBreak={ 'keep-all' }
                                >

                                    {
                                        userData && userData?.display_name ? (
                                            <Box>
                                                <Text><u><b>Username: </b></u></Text>
                                                <Text noOfLines={ [ 1, 2, 3 ] }>{ userData.display_name }</Text>
                                            </Box>
                                        ) : (
                                            <></>
                                        )
                                    }

                                    {
                                        userData && userData?.role ? (
                                            <Box>
                                                <Text><u><b>Role: </b></u></Text>
                                                <Text noOfLines={ [ 1, 2, 3 ] }>{ userData.role }</Text>
                                            </Box>
                                        ) : (
                                            <></>
                                        )
                                    }

                                    {
                                        userData && userData?.register_date ? (
                                            <Box>
                                                <Text><u><b>Joined: </b></u></Text>
                                                <Text noOfLines={ [ 1, 2, 3 ] }>{ util.time.convertDate( new Date( userData.register_date ) ) }</Text>
                                            </Box>
                                        ) : (
                                            <></>
                                        )
                                    }

                                    {
                                        userData && userData?.about ? (
                                            <Box>
                                                <Text><u><b>About: </b></u></Text>
                                                <Text noOfLines={ [ 1, 2, 3 ] }>{ userData.about }</Text>
                                            </Box>
                                        ) : (
                                            <></>
                                        )
                                    }

                                    {
                                        userData && userData?.status ? (
                                            <Box>
                                                <Text><u><b>Status: </b></u></Text>
                                                <Text noOfLines={ [ 1, 2, 3 ] }>{ userData.status }</Text>
                                            </Box>
                                        ) : (
                                            <></>
                                        )
                                    }

                                </Box>
                            </Box>
                        </Box>


*/