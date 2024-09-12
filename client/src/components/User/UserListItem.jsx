import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../context/ChatProvider";
import { Button, IconButton, Tooltip, useColorModeValue } from "@chakra-ui/react";
import ProfileInfo from "./ProfileInfo";
import * as util from 'akashatools';
import UserAvatar from "./UserAvatar";
import { useEffect, useState } from "preact/hooks";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";

const UserListItem = ( props ) => {
    // TODO :: Add lazy loading for user profiles. 

    const {
        userData, // For providing user data by object.
        userID, // For fetching user data by ID, rather than by object. 
        handleFunction // Function to parse when clicking the item. 
    } = props;

    const { user } = ChatState();

    const [ listUser, setListUser ] = useState(); // Start as undefined. 

    const fetchUserProfile = async ( user_id ) => {
        console.log( "fetchUserProfile :: ", user );
        let response;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${ user.token }`,
                },
            };

            response = await axios.get( `/api/user/${ user_id }`, config );
            console.log( "fetchUserProfile :: response = ", response );

            if ( response.data ) {
                console.log( "fetchUserProfile :: response.data.data = ", response.data.data );

                let data = response.data.data;
                setListUser( data );
            }
        } catch ( error ) {
            let msg = error.message;
            if ( error.response?.data?.message ) {
                // If alternate error message given
                msg = error.response.data.message;
            }
            console.log( "fetchUserProfile :: msg = ", msg );
        }
    }

    useEffect( () => {
        // If no passed object and have ID on load, fetch user data. 
        if ( !listUser && !userData && userID ) {
            fetchUserProfile( userID );
        }
        else {
            setListUser( userData );
        }
    }, [] );

    return (
        listUser && (
            <Box
                my={1}
                // onClick={ handleFunction }
                cursor="pointer"
                // bg="#E8E8E8"
                bg={ useColorModeValue(
                    'gray.light',
                    'gray.dark'
                ) }
                // bg={
                //     useColorModeValue("#E8E8E8", 'blackAlpha.100')
                // }
                _hover={ {
                    backgroundColor: useColorModeValue( 'gray.100', 'blackAlpha.200' ),
                    color: useColorModeValue( 'gray.800', 'gray.100' ),
                    boxShadow: `inset 0px 0px 12px -8px #000000`,
                } }
                w={ "100%" }
                display={ "flex" }
                alignItems={ "center" }
                color={ "black" }
                px={ 0 }
                py={ 0 }
                mb={ 0 }
                borderRadius={ "lg" }
                // border={ '1px' }
            >

                {
                    /*
                        Custom avatar component combining avatar, popover/tooltip, and a mini profile view. 
                    */
                }
                <UserAvatar
                    userData={ listUser }
                    size={ 'md' }
                />

                <Box
                    bg={ 'none' }
                    gap={ 0 }
                    p={ 0 }
                    m={ 0 }
                    w={ "100%" }
                    h={ "100%" }
                    alignItems={ 'stretch' }
                    flexDirection={ 'column' }
                    // border={ '1px' }
                >
                    <Text
                        fontSize={ `${ 0.85 }rem` }
                        m={ 0 }
                        p={ 0 }
                        as={ 'b' }
                        w={ "100%" }
                        h={ "100%" }
                    >{ listUser.display_name }</Text>
                    <Text
                        fontSize={ `${ 0.65 }rem` }
                        m={ 0 }
                        p={ 0 }
                        w={ "100%" }
                        h={ "100%" }
                    >
                        { listUser?.status }
                    </Text>
                </Box>
                <IconButton
                    onClick={ handleFunction }
                    isRound={ true }
                    _hover={ {
                        bg: useColorModeValue( 'blackAlpha.800', 'blackAlpha.200' ),
                        // bg: "#38B2AC",
                        color: "white",
                    } }
                    fontSize='20px'
                    bg={ 'none' }
                    size={ 'xs' }
                    icon={ <AiOutlinePlusCircle p={ 0 } /> }
                />
            </Box>
        )
    );
};

export default UserListItem;