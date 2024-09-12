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
        children,
        forceClose
    } = props;

    const {
        user,
        setUser,
        fetchUser,
        setFetchUser,
    } = ChatState();
    const toast = useToast();

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
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            // localStorage.setItem( "userInfo", JSON.stringify( updatedUserData ) );
            
            setFriendLoading( false );

            // // Spoof the change locally. 
            // let userUpdate = { ...user };
            // if ( isFriend ) {
            //     // Was already friends, so remove locally. 
            //     userUpdate.friends = [ ...userUpdate.friends ].filter( u => u._id != friendID );
            // }
            // else {
            //     // Was not yet friends, so add locally. 
            //     userUpdate.friends = [ ...userUpdate.friends, friendID ];
            // }
            // setUser( userUpdate );
            // 
            // console.log( "ProfileModal :: handleFriend :: userUpdate = ", userUpdate );

            // Tell the state handler to fetch this user's profile after the change was made. 
            setFetchUser( true );

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
                duration: 5000,
                isClosable: true,
                position: "bottom",
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
                duration: 5000,
                isClosable: true,
                position: "bottom",
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
                duration: 5000,
                isClosable: true,
                position: "bottom",
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
                    bg={ useColorModeValue(
                        'gray.light',
                        'gray.dark'
                    ) }>
                    <ModalHeader
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="left"
                        bg='blackAlpha.300'
                        px={ 2 }
                        py={ 1 }
                        m={ 0 }
                    >
                        { userData ? userData.name : '' }'s Profile
                        <ModalCloseButton size={ 'sm' } />
                    </ModalHeader>
                    <ModalBody
                        bg={ useColorModeValue(
                            'gray.light',
                            'gray.dark'
                        ) }
                        display={ "flex" }
                        flexDir={ "column" }
                        alignItems={ "center" }
                        w={ '100%' }
                        h={ '100%' }
                    >
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
                    </ModalBody>
                    <ModalFooter
                        p={ 1 }
                        bg={ useColorModeValue(
                            'gray.light',
                            'gray.dark'
                        ) }
                    >
                        <Button onClick={ onClose } size={ 'sm' }>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProfileModal;