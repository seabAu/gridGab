
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
    useColorModeValue,
    useColorMode,
    InputGroup,
    InputLeftAddon,
    Checkbox,
    InputLeftElement,
    VStack,
    Spinner,
    CheckboxGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "preact/hooks";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";
import ChatLoading from "./ChatLoading";

const CreateChatModal = ( { children } ) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const initialRef = useRef( null );
    const finalRef = useRef( null );
    const [ groupChatName, setGroupChatName ] = useState( "" );
    const [ isPublic, setIsPublic ] = useState( false );
    const [ selectedUsers, setSelectedUsers ] = useState( [] );
    const [ search, setSearch ] = useState( "" );
    const [ searchResult, setSearchResult ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const toast = useToast();

    const {
        user,
        chats,
        setChats,
        fetchChats,
        setFetchChats,
        selectedChat,
        setSelectedChat
    } = ChatState();

    const handleGroup = ( newUser ) => {
        if ( selectedUsers.find( ( u ) => u._id === newUser._id ) ) {
            // if ( selectedUsers.includes( userToAdd ) ) {
            toast( {
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            } );
            return;
        }

        setSelectedUsers( [ ...selectedUsers, newUser ] );
    };

    const handleSearch = async ( query ) => {
        // Search for viable users to invite to a group chat.
        setSearch( query );
        console.log( "CreateChatModal :: handleSearch :: query = ", query, ' :: ', 'selectedUsers = ', selectedUsers );
        if ( !query ) {
            return;
        }

        try {
            setLoading( true );
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            const response = await axios.get( `/api/user?search=${ search }`, config );

            // console.log(
            //     "CreateChatModal",
            //     " :: ", "handleSearch",
            //     " :: ", "token = ", user.token,
            //     " :: ", "search = ", search,
            //     " :: ", "response = ", response,
            //     " :: ", "response.data.data = ", response.data.data
            // );

            let data = response.data.data;

            setLoading( false );
            setSearchResult( data );
        } catch ( error ) {
            toast( {
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            } );
        }
    };

    const handleDelete = ( delUser ) => {
        setSelectedUsers( selectedUsers.filter( ( sel ) => sel._id !== delUser._id ) );
    };

    const handleSubmit = async () => {
        if ( !selectedUsers ) {
            toast( {
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            } );
            return;
        }

        let response;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };
            response = await axios.post(
                `/api/chat/new`,
                {
                    chatName: groupChatName,
                    isPublicChat: isPublic,
                    users: JSON.stringify( selectedUsers.map( ( u ) => u._id ) ),
                    chatIcon: '',
                    chatStatus: '',
                },
                config
            );

            // console.log(
            //     "CreateChatModal",
            //     " :: ", "handleSubmit",
            //     " :: ", "token = ", user.token,
            //     " :: ", "groupChatName = ", groupChatName,
            //     " :: ", "response = ", response,
            //     " :: ", "response.data.data = ", response.data.data
            // );

            let newChat = response.data.data;

            setChats( [ newChat, ...chats ] );
            setSelectedChat( newChat );

            // Re-fetch the chats
            setFetchChats( true );

            onClose();
            toast( {
                title: "New Group Chat Created!",
                // description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
        } catch ( error ) {
            // console.log(
            //     "CreateChatModal",
            //     " :: ", "handleSubmit",
            //     " :: ", "ERROR",
            //     " :: ", "response = ", response,
            //     " :: ", "error = ", error,
            // );

            toast( {
                title: "Failed to create group chat!",
                // description: error.response.data,
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
        }
    };

    const handleChange = async ( value, value_id ) => {

    }

    return (
        <>
            <span onClick={ onOpen }>{ children }</span>

            <Modal
                onClose={ onClose }
                isOpen={ isOpen }
                isCentered
                initialFocusRef={ initialRef }
                finalFocusRef={ finalRef }
                closeOnOverlayClick={ true }
                scrollBehavior={ 'inside' }
                size={ 'lg' }
            >
                <ModalOverlay
                // bg={ 'blackAlpha.300' }
                // backdropFilter={ 'blur(10px) hue-rotate(90deg)' }
                />
                <ModalContent
                    bg={ useColorModeValue(
                        'gray.light',
                        'gray.dark'
                    ) }>
                    <ModalHeader
                        // style={ { width: '100%' } }
                        fontFamily="Work sans"
                        fontSize={ '18px' }
                        display={ "flex" }
                        justifyContent={ "center" }
                        p={ 2 }
                        m={ 0 }
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton size={ 'sm' } />
                    <ModalBody
                        display={ "flex" }
                        flexDir={ "column" }
                        alignItems={ "center" }
                    >
                        <VStack
                            gap={ `${ 1 }rem` }
                            mb={ `${ 1 }rem` }
                            display={ "flex" }
                            flexDir={ "column" }
                            alignItems={ "center" }
                            width={ '100%' }
                        >
                            <FormControl id={ 'chatName' }>
                                <InputGroup size={ 'xs' }>
                                    <InputLeftAddon width={ '5rem' }>Chat Name</InputLeftAddon>
                                    <Input
                                        onChange={ ( e ) => setGroupChatName( e.target.value ) }
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl id={ 'usersearch' }>
                                <InputGroup size={ 'xs' }>
                                    <InputLeftAddon width={ '5rem' }>Users</InputLeftAddon>
                                    <Input
                                        onChange={ ( e ) => handleSearch( e.target.value ) }
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl id={ 'public' }>
                                <InputGroup
                                    border={ '1px' }
                                    borderColor={ 'blackAlpha.300' }
                                    size={ 'xs' }
                                >
                                    <InputLeftAddon
                                        width={ '5rem' }
                                    >Set Public</InputLeftAddon>
                                    <CheckboxGroup
                                        defaultValue={ [
                                            isPublic ? 'public' : undefined
                                        ] }
                                    >
                                        <Checkbox
                                            value={ 'public' }
                                            size={ 'lg' }
                                            px={ 2 }
                                            // isChecked={ selectedChat?.isPublicChat }
                                            onChange={ ( e ) => { setIsPublic( e.target.checked ); } }
                                        />
                                    </CheckboxGroup>
                                </InputGroup>
                            </FormControl>

                        </VStack>

                        <Box
                            w={ "100%" }
                            display={ "flex" }
                            flexWrap={ "wrap" }
                        >
                            { selectedUsers.map( ( u ) => (
                                <UserBadgeItem
                                    key={ u._id }
                                    userData={ u }
                                    // handleFunction={ () => handleDelete( u ) }
                                    // Change handlefunction to what happens when you click on the badge overall. 
                                    // For badges, it'll show their profile once implemented. 
                                    handleFunction={ () => { } }
                                    closeFunction={ () => handleDelete( u ) }
                                />
                            ) ) }
                        </Box>

                        <VStack
                            w={ "100%" }
                            display={ "flex" }
                            flexWrap={ "nowrap" }
                            gap={ 1 }
                            // bg={ 'blackAlpha.300' }
                            boxShadow={ `inset 0px 0px 12px -8px #000000` }

                            overflowY={ 'auto' }
                            px={ 1 }
                            py={ 1 }
                        >
                            { loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult?.filter( ( resultUser ) => ( !selectedUsers.includes( resultUser ) ) )
                                    // ?.slice( 0, 10 )
                                    .map( ( u ) => (
                                        <UserListItem
                                            key={ u._id }
                                            userData={ u }
                                            handleFunction={ () => handleGroup( u ) }
                                        />
                                    ) )
                            ) }
                        </VStack>
                    </ModalBody>
                    <ModalFooter
                        p={ 1 }
                        bg={ 'blackAlpha.300' }
                        borderEndEndRadius={ 'md' }
                        borderEndStartRadius={ 'md' }
                    >
                        <Button
                            onClick={ handleSubmit }
                            colorScheme="blue"
                            size={ 'xs' }
                        >
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};


export default CreateChatModal
