
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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "preact/hooks";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";

const CreateChatModal = ( { children } ) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ groupChatName, setGroupChatName ] = useState();
    const [ selectedUsers, setSelectedUsers ] = useState( [] );
    const [ search, setSearch ] = useState( "" );
    const [ searchResult, setSearchResult ] = useState( [] );
    const [ loading, setLoading ] = useState( false );
    const toast = useToast();

    const { user, chats, setChats, fetchChats, setFetchChats, selectedChat, setSelectedChat } = ChatState();

    const handleGroup = ( userToAdd ) => {
        if ( selectedUsers.includes( userToAdd ) ) {
            toast( {
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            } );
            return;
        }

        setSelectedUsers( [ ...selectedUsers, userToAdd ] );
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
            
            console.log(
                "CreateChatModal",
                " :: ", "handleSearch",
                " :: ", "token = ", user.token,
                " :: ", "search = ", search,
                " :: ", "response = ", response,
                " :: ", "response.data.data = ", response.data.data
            );

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
        if ( !groupChatName || !selectedUsers ) {
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
                `/api/chat/group`,
                {
                    chatName: groupChatName,
                    users: JSON.stringify( selectedUsers.map( ( u ) => u._id ) ),
                },
                config
            );

            console.log(
                "CreateChatModal",
                " :: ", "handleSubmit",
                " :: ", "token = ", user.token,
                " :: ", "groupChatName = ", groupChatName,
                " :: ", "response = ", response,
                " :: ", "response.data.data = ", response.data.data
            );

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
            console.log(
                "CreateChatModal",
                " :: ", "handleSubmit",
                " :: ", "ERROR",
                " :: ", "response = ", response,
                " :: ", "error = ", error,
            );

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

    return (
        <>
            <span onClick={ onOpen }>{ children }</span>

            <Modal onClose={ onClose } isOpen={ isOpen } isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={ 3 }
                                onChange={ ( e ) => setGroupChatName( e.target.value ) }
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users"
                                mb={ 1 }
                                onChange={ ( e ) => handleSearch( e.target.value ) }
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            { selectedUsers.map( ( u ) => (
                                <UserBadgeItem
                                    key={ u._id }
                                    user={ u }
                                    handleFunction={ () => handleDelete( u ) }
                                />
                            ) ) }
                        </Box>
                        { loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult?.filter( (resultUser)=>( !selectedUsers.includes( resultUser ) ) )
                                // ?.slice( 0, 10 )
                                .map( ( user ) => (
                                    <UserListItem
                                        key={ user._id }
                                        user={ user }
                                        handleFunction={ () => handleGroup( user ) }
                                    />
                                ) )
                        ) }
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={ handleSubmit } colorScheme="blue">
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};


export default CreateChatModal
