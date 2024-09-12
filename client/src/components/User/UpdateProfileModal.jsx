// Component used for updating one's own profile. 

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
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    VStack,
    FormControl,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Input,
    InputRightElement,
    Tab,
    TabIndicator,
    Textarea,
    useToast,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'preact/hooks';
import { ViewIcon } from '@chakra-ui/icons';
import * as util from 'akashatools';
import UserListItem from './UserListItem';
import { ChatState } from '../../context/ChatProvider';
import { uploadImage } from '../../utilities/user';
import axios from 'axios';
import ProfileModal from './ProfileModal';

const UpdateProfileModal = ( props ) => {
    const {
        children,
        tabSize = 'xs',
        tabFormat = 'unstyled',
        initialTab = 0,
        debug,
    } = props;
    
    const {
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        fetchChats,
        setFetchChats
    } = ChatState();
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const finalRef = useRef( null );
    const initialRef = useRef( null );

    const [ userData, setUserData ] = useState( { ...user } ); // An editable copy of the user data stored in state. Will only overwrite it once a change is submitted to the server. 
    const [ loading, setLoading ] = useState( false );
    const [ profileChanged, setProfileChanged ] = useState( false );
    const [ currentPassword, setCurrentPassword ] = useState( '' );
    const [ showPassword, setShowPassword ] = useState( false );
    const [ avatarTemp, setAvatarTemp ] = useState( null );

    useEffect( () => {
        // Trigger whenever a change is made to the user info.

        let changed = false;
        Object.keys( userData ).forEach( ( key ) => {
            if ( userData[ key ] ) {
                let value = userData[ key ];
                if ( user[ key ] !== value ) {
                    // return true;
                    changed = true;
                }
            }
        } );

        // If we reach this point with changed === false, then nothing has changed. 
        if ( changed ) {
            // Regardless of whether a change was detected, these are no longer equivalent.
            console.log( "Detected a change to userData: [", userData, "]" );
            setProfileChanged( true );
        }
    }, [ userData ] );

    useEffect( () => {
        console.log( "Detected a change to profileChanged: [", profileChanged, "]" );
    }, [ profileChanged ] );

    useEffect( () => {
        // Catch any changes to the state version of the user data. 
        console.log( "Detected a change to user: [", user, "]" );
        setUserData( user );
    }, [ user ] );

    const handleCancel = () => {
        setUserData( user );
        setProfileChanged( false );
        setShowPassword( false );
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
            // setUserData( user );
            // setProfileChanged( false );
            // setShowPassword( false );
            setLoading( false );
        }
    }

    const handleAvatarChange = ( avatar ) => {
        // Upload temp picture to cloudinary
        setLoading( true );

        if ( avatar === undefined ) {
            toast( {
                title: "Please select an image.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            return;
        }
        console.log( avatar );
        if ( avatar.type === "image/jpeg" || avatar.type === "image/png" ) {
            const cloudName = 'dcbbqg2vp';
            const url = `https://api.cloudinary.com/v1_1/${ cloudName }/upload`;
            const data = new FormData();
            data.append( "file", avatar );
            data.append( "upload_preset", "gridchat" );
            data.append( "cloud_name", cloudName );

            fetch( url, {
                method: "post",
                body: data,
            } )
                .then( ( res ) => res.json() )
                .then( ( data ) => {
                    console.log( data.url.toString() );
                    setLoading( false );
                    handleChange( data.url.toString(), 'avatar' );
                } )
                .catch( ( err ) => {
                    console.log( err );
                    setLoading( false );
                } );
        } else {
            toast( {
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            setLoading( false );
            return;
        }
    }

    const handleAvatarChange2 = ( file ) => {
        if ( file ) {
            // File is not null.
            // Set avatar temp to file just in case. 
            setAvatarTemp( file );

            // Await the upload utility. 
            let res;
            try {
                res = uploadImage( file );
                console.log( "handleAvatarChange", " :: ", "res = ", res );
                if ( res ) {
                    if ( res.data ) {
                        let url = res.data;
                        handleChange( url, 'avatar' );
                    }
                }
            } catch ( error ) {
                toast( {
                    title: "Error: " + error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                } );
            } finally {
                setAvatarTemp( null );
            }
        }
    }

    const handleChange = ( val, value_id ) => {
        // const val = e.target.value;

        if ( val ) {
            // Check that the value_id exists in the userData object first.
            if ( value_id in userData ) {
                // Go ahead and set the value. 
                let updateUserData = userData;
                updateUserData[ value_id ] = val;

                setUserData( updateUserData );
                setProfileChanged( true );
                console.log( "HandleChange :: updateUserData is: ", updateUserData, " :: ", "profileChanged: ", profileChanged );
            }
            else {
                // Field not in user. Add it anyways, and let the 
            }
        }
    }

    // The { children } prop in this component is just the button or other element used to open this modal. 
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
                size={ 'xl' }
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
                    onBlur={ onClose }
                />
                <ModalContent
                    h={ `${ 90 }%` }
                    w={ `${ 800 }px` }
                    height={ `${ 90 }%` }
                    width={ `${ 75 }vw` }
                    maxWidth={ `${ 75 }vw` }
                    minWidth={ `${ 75 }vw` }
                    style={ {
                        maxWidth: `90% !important`,
                    } }
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
                        { user ? user.name : '' }'s Profile
                        <ModalCloseButton size={ 'sm' } />
                    </ModalHeader>

                    <ModalBody
                        display={ "flex" }
                        flexDir={ "column" }
                        alignItems={ "center" }
                        bg={ useColorModeValue(
                            'gray.light',
                            'gray.dark'
                        ) }
                    >

                        <Box
                            w={ `${ 100 }%` }
                            h={ `${ 100 }%` }
                            p={ 4 }
                            borderRadius='lg'
                            borderWidth='1px'>
                            <Box
                                // Left Side Panel
                                display={ 'flex' }
                                flexDir={ 'column' }
                                // border={ '1px' }
                                alignItems={ "center" }
                                flexGrow={ 0 }
                                px={ `${ 0.5 }em` }
                                py={ `${ 0.75 }em` }
                                minW={ '25%' }
                                w={ '100%' }
                            >
                                <Image
                                    borderRadius="full"
                                    boxSize="96px"
                                    src={ userData ? userData.avatar : '' }
                                    alt={ userData ? userData.name : '' }
                                // w={ '64px' }
                                // h={ '64px' }
                                />
                            </Box>

                            <Tabs
                                variant={ tabFormat }
                                size={ tabSize }
                                isFitted
                                defaultIndex={ initialTab }
                            >
                                <TabList mb={ `${ 0.5 }em` }>
                                    <Tab>Profile</Tab>
                                    <Tab>Friends</Tab>
                                </TabList>

                                <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px' />
                                <TabPanels>
                                    <TabPanel px={ 1 } pt={ 8 } pb={ 2 }>
                                        {
                                            /*
                                                // User profile details and fields to edit them. 
                                            */
                                        }
                                        {
                                            userData &&
                                            <VStack
                                                spacing='5px'
                                                color='black'
                                            >

                                                <FormControl
                                                    id={ 'name' }
                                                    isRequired
                                                >
                                                    <InputGroup
                                                        size={ 'xs' }
                                                    >
                                                        <InputLeftAddon
                                                            width={ `${ 6.5 }rem` }
                                                        >
                                                            Account Name
                                                        </InputLeftAddon>

                                                        <Input
                                                            type={ 'text' }
                                                            defaultValue={ userData.name }
                                                            onChange={
                                                                ( e ) => {
                                                                    handleChange(
                                                                        e.target.value,
                                                                        'name'
                                                                    );
                                                                } }
                                                        />
                                                    </InputGroup>
                                                </FormControl>

                                                <FormControl
                                                    id={ 'display_name' }
                                                    isRequired
                                                >
                                                    <InputGroup
                                                        size={ 'xs' }
                                                    >
                                                        <InputLeftAddon
                                                            width={ `${ 6.5 }rem` }
                                                        >
                                                            Display Name
                                                        </InputLeftAddon>

                                                        <Input
                                                            type={ 'text' }
                                                            defaultValue={ userData.display_name }
                                                            onChange={
                                                                ( e ) => {
                                                                    handleChange(
                                                                        e.target.value,
                                                                        'display_name'
                                                                    );
                                                                } }
                                                        />
                                                    </InputGroup>

                                                </FormControl>

                                                <FormControl
                                                    id={ 'status' }
                                                >
                                                    <InputGroup
                                                        size={ 'xs' }
                                                    >
                                                        <InputLeftAddon
                                                            width={ `${ 6.5 }rem` }
                                                        >
                                                            Status
                                                        </InputLeftAddon>

                                                        <Textarea
                                                            size={ 'xs' }
                                                            defaultValue={ userData.status }
                                                            onChange={
                                                                ( e ) => {
                                                                    handleChange(
                                                                        e.target.value,
                                                                        'status'
                                                                    );
                                                                } }
                                                        />
                                                    </InputGroup>
                                                </FormControl>

                                                <FormControl
                                                    id={ 'about' }
                                                >
                                                    <InputGroup
                                                        size={ 'xs' }
                                                    >
                                                        <InputLeftAddon
                                                            width={ `${ 6.5 }rem` }
                                                        >
                                                            About
                                                        </InputLeftAddon>

                                                        <Textarea
                                                            size={ 'xs' }
                                                            defaultValue={ userData.about }
                                                            onChange={
                                                                ( e ) => {
                                                                    handleChange(
                                                                        e.target.value,
                                                                        'about'
                                                                    );
                                                                } }
                                                        />
                                                    </InputGroup>

                                                </FormControl>

                                                <FormControl
                                                    id={ 'email' }
                                                    isRequired
                                                >
                                                    <InputGroup
                                                        size={ 'xs' }
                                                    >
                                                        <InputLeftAddon
                                                            width={ `${ 6.5 }rem` }
                                                        >
                                                            Email
                                                        </InputLeftAddon>

                                                        <Input
                                                            type={ 'text' }
                                                            defaultValue={ userData.email }
                                                            onChange={
                                                                ( e ) => {
                                                                    handleChange(
                                                                        e.target.value,
                                                                        'email'
                                                                    );
                                                                } }
                                                        />
                                                    </InputGroup>

                                                </FormControl>


                                                <FormControl
                                                    id={ 'avatar' }
                                                >
                                                    <InputGroup
                                                        size={ 'xs' }
                                                    >
                                                        <InputLeftAddon
                                                            width={ `${ 6.5 }rem` }
                                                        >
                                                            Avatar
                                                        </InputLeftAddon>

                                                        <Input
                                                            type={ 'text' }
                                                            defaultValue={ userData.avatar }
                                                        // onChange={
                                                        //     ( e ) => {
                                                        //         handleAvatarChange(
                                                        //             e.target.value,
                                                        //             'avatar'
                                                        //         );
                                                        //     } }
                                                        />

                                                        <InputRightAddon
                                                            px={ '0px' }
                                                            py={ '0px' }
                                                            w={ 75 }
                                                            m={ 0 }
                                                        >
                                                            <Input
                                                                type="file"
                                                                px={ 0 }
                                                                py={ 0 }
                                                                w={ 75 }
                                                                h={ '100%' }
                                                                m={ 0 }
                                                                size={ `xs` }
                                                                bg={ 'none' }
                                                                borderRadius={ '0' }
                                                                accept="image/*"
                                                                onChange={
                                                                    ( e ) => {
                                                                        handleAvatarChange( e.target.files[ 0 ] );
                                                                    }
                                                                }
                                                            />

                                                        </InputRightAddon>
                                                    </InputGroup>
                                                </FormControl>


                                                <FormControl
                                                    id={ 'password' }
                                                    isRequired
                                                >
                                                    <InputGroup
                                                        size={ 'xs' }
                                                    >
                                                        <InputLeftAddon
                                                            width={ `${ 6.5 }rem` }
                                                        >
                                                            Password
                                                        </InputLeftAddon>

                                                        <Input
                                                            type={ showPassword ? `text` : `password` }
                                                            placeholder='New password'
                                                            defaultValue={ user.password }
                                                            onChange={ ( e ) => {
                                                                handleChange(
                                                                    e.target.value,
                                                                    'password'
                                                                );
                                                            } }
                                                        />

                                                        <InputRightAddon
                                                            px={ '0px' }
                                                            py={ '0px' }
                                                            w={ 75 }
                                                        >
                                                            <Button
                                                                w={ '100%' }
                                                                h={ '100%' }
                                                                fontSize={ 'xs' }
                                                                size={ `xs` }
                                                                bg={ 'none' }
                                                                borderRadius={ '0' }
                                                                bgColor={ showPassword ? `grey` : `grey` }
                                                                onClick={ () => {
                                                                    setShowPassword(
                                                                        !showPassword
                                                                    );
                                                                } }>
                                                                { showPassword
                                                                    ? 'Hide'
                                                                    : 'Show' }
                                                            </Button>
                                                        </InputRightAddon>

                                                    </InputGroup>

                                                </FormControl>

                                                {
                                                    profileChanged && userData && (
                                                        <Box
                                                            display={ 'flex' }
                                                            flexDir={ 'row' }
                                                            alignItems={ "center" }
                                                            flexGrow={ 0 }
                                                            px={ `${ 0.5 }em` }
                                                            py={ `${ 0.75 }em` }
                                                            minW={ '25%' }
                                                            w={ '100%' }
                                                            gap={ 4 }
                                                        >
                                                            <Button
                                                                colorScheme="blue"
                                                                size={ 'xs' }
                                                                onClick={ () => {
                                                                    handleCancel();
                                                                } }
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                variant="solid"
                                                                colorScheme="red"
                                                                size={ 'xs' }
                                                                onClick={ () => {
                                                                    handleSubmit();
                                                                } }
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </Box>
                                                    )
                                                }

                                                {
                                                    // Debug stuff. Remove later. 
                                                    profileChanged && userData && (
                                                        <Box>
                                                            {
                                                                JSON.stringify( userData, null, 2 )
                                                            }
                                                        </Box>
                                                    )
                                                }
                                            </VStack>
                                        }

                                    </TabPanel>
                                    <TabPanel>
                                        {
                                            /*
                                                // Friends list goes here. 
                                                // It will use UserListItem for each friend listed, except clicking it will open their full profile modal instead of adding them to a chat. 
                                            */
                                        }
                                        { util.val.isValidArray( user.friends, true ) ? (
                                            user.friends.map( ( uid ) => (
                                                <UserListItem
                                                    key={ uid }
                                                    userID={ uid }
                                                    handleFunction={ () => {
                                                        // Close this modal, delete all unsaved profile updates, and
                                                        // open the clicked friend's profile view instead. 
                                                        setUserUpdates( {} );
                                                        onClose();
                                                    } }
                                                />
                                            ) )
                                        ) : (
                                            <>{ `You are maidenless. ` }</>
                                        ) }
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>

                    </ModalBody>
                    <ModalFooter
                        p={ 1 }
                        bg={ useColorModeValue(
                            'gray.light',
                            'gray.dark'
                        ) }
                    >
                        <Button
                            onClick={ onClose }
                            size={ 'xs' }
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateProfileModal;