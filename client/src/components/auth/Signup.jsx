import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'preact/hooks';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const [
        showPassword,
        setShowPassword,
    ] = useState( false );
    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState( false );
    const [ name, setName ] = useState( '' );
    const [ email, setEmail ] =
        useState( '' );
    const [ password, setPassword ] =
        useState( '' );
    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState( '' );
    const [ avatar, setAvatar ] = useState();
    const [ avatarLoading, setAvatarLoading ] = useState( false );

    const submitHandler = async () => {
        // Submit details to server. 
        setAvatarLoading( true );

        if ( !name || !email || !password || !confirmPassword ) {
            // Are all fields filled in
            toast( {
                title: "Please fill in all fields.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            setAvatarLoading( false );
            return;
        }

        if ( password != confirmPassword ) {
            // Do passwords match
            toast( {
                title: "The passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            setAvatarLoading( false );
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post(
                "/api/user/",
                {
                    name,
                    email,
                    password,
                    avatar,
                },
                config
            );
            const data = response.data;
            const user = data.data;

            console.log( "Axios :: received: ", data );

            toast( {
                title: response.data.message ? response.data.message :  "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            localStorage.setItem( "userInfo", JSON.stringify( user ) );
            setAvatarLoading( false );
            navigate( "/chat" );
        } catch ( error ) {
            toast( {
                title: "An error occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            setAvatarLoading( false );
        }
    }

    const handleSelectAvatar = ( avatar ) => {
        // Upload temp picture to cloudinary
        setAvatarLoading( true );

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
            const data = new FormData();
            data.append( "file", avatar );
            data.append( "upload_preset", "gridchat" );
            data.append( "cloud_name", "dcbbqg2vp" );
            fetch( "https://api.cloudinary.com/v1_1/dcbbqg2vp/image/upload", {
                method: "post",
                body: data,
            } )
                .then( ( res ) => res.json() )
                .then( ( data ) => {
                    setAvatar( data.url.toString() );
                    console.log( data.url.toString() );
                    setAvatarLoading( false );
                } )
                .catch( ( err ) => {
                    console.log( err );
                    setAvatarLoading( false );
                } );
        } else {
            toast( {
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            setAvatarLoading( false );
            return;
        }
    }

    function sRandom(length) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        
        // Loop to generate characters for the specified length
        for (let i = 0; i < length; i++) {
            const randomInd = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomInd);
        }
        return result;
    }

    const randomizeCredentials = () => {
        let rName = sRandom( 12 );
        let rEmail = `${ sRandom( 12 ) }@${ sRandom( 6 ) }.com`;
        let rPass = sRandom( 32 );

        setName( rName );
        setEmail( rEmail );
        setPassword( rPass );
        setConfirmPassword( rPass );
    }

    return (
        <VStack
            spacing='5px'
            color='black'>
            <FormControl
                id={ 'name' }
                isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    value={name}
                    onChange={ ( e ) => {
                        setName( e.target.value );
                    } }
                />
            </FormControl>

            <FormControl
                id={ 'email' }
                isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    value={email}
                    onChange={ ( e ) => {
                        setEmail( e.target.value );
                    } }
                />
            </FormControl>

            <FormControl
                id={ 'password' }
                isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={ showPassword ? `text` : `password` }
                        placeholder='Enter a password'
                        value={password}
                        onChange={ ( e ) => {
                            setPassword(
                                e.target.value
                            );
                        } }
                    />

                    <InputRightElement
                        width={ `4.5rem` }>
                        <Button
                            bgColor={ showPassword ? `grey` : `white` }
                            h='1.75rem'
                            size='sm'
                            onClick={ () => {
                                setShowPassword(
                                    !showPassword
                                );
                            } }>
                            { showPassword
                                ? 'Hide'
                                : 'Show' }
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl
                id={ 'confirmPassword' }
                isRequired>
                <FormLabel>
                    Confirm Password
                </FormLabel>
                <InputGroup>
                    <Input
                        type={ showConfirmPassword ? `text` : `password` }
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={ ( e ) => {
                            setConfirmPassword(
                                e.target.value
                            );
                        } }
                    />

                    <InputRightElement
                        width={ `4.5rem` }>
                        <Button
                            bgColor={ showConfirmPassword ? `grey` : `white` }
                            h='1.75rem'
                            size='sm'
                            onClick={ () => {
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                );
                            } }>
                            { showConfirmPassword
                                ? 'Hide'
                                : 'Show' }
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <FormControl id="avatar">
                <FormLabel>Upload your Avatar</FormLabel>
                <Input
                    type="file"
                    p={ 1.5 }
                    accept="image/*"
                    onChange={ ( e ) => handleSelectAvatar( e.target.files[ 0 ] ) }
                />
            </FormControl>


            <Button
                colorScheme="blue"
                width="100%"
                style={ { marginTop: 15 } }
                onClick={ submitHandler }
                isLoading={ avatarLoading }
            >
                Sign Up
            </Button>
            
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={ () => {
                    randomizeCredentials();
                } }
            >
                Create Random
            </Button>

        </VStack>
    );
};

export default Signup;
