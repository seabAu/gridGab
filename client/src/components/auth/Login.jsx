import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useColorModeValue,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'preact/hooks';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { colorMode, toggleColorMode } = useColorMode();
    const [ showPassword, setShowPassword ] = useState( false );
    const [ showConfirmPassword, setShowConfirmPassword ] = useState( false );
    const [ name, setName ] = useState();
    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();
    const [ confirmPassword, setConfirmPassword ] = useState();
    const [ loading, setLoading ] = useState( false );

    const submitHandler = async () => {
        // Submit details to server. 
        setLoading( true );
        if ( !name || !password ) {
            toast( {
                title: "Please fill in all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            setLoading( false );
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const response = await axios.post(
                "/api/user/login",
                { name, password },
                config
            );

            const data = response.data;
            const user = data.data;
            console.log( "Axios :: received: ", data );
            toast( {
                title: response.data.message ? response.data.message : "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );

            // Update state
            // setUser( data );

            // Update localstorage.
            localStorage.setItem( "userInfo", JSON.stringify( user ) );

            setLoading( false );

            navigate( "/chat" );
        } catch ( error ) {
            console.log( "Axios :: error: ", error );
            toast( {
                title: "An error occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            } );
            setLoading( false );
        }
    };

    return (
        <VStack
            spacing='5px'
            color='black'
            bg={ useColorModeValue( 'gray.200', 'gray.800' ) }
        >
            <FormControl
                id={ 'name' }
                isRequired>
                <FormLabel>Account Name</FormLabel>
                <Input
                    placeholder='Enter your username'
                    value={ name }
                    onChange={ ( e ) => {
                        setName( e.target.value );
                    } }
                    bg={ useColorModeValue( 'gray.200', 'gray.dark' ) }
                />
            </FormControl>

            { /*
            <FormControl
                id={ 'email' }
                isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    value={ email }
                    onChange={ ( e ) => {
                        setEmail( e.target.value );
                    } }
                />
            </FormControl>
            */ }

            <FormControl
                id={ 'password' }
                isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={ showPassword ? `text` : `password` }
                        placeholder='Enter your password'
                        value={ password }
                        onChange={ ( e ) => {
                            setPassword(
                                e.target.value
                            );
                        } }
                    />

                    <InputRightElement
                        width={ `4.5rem` }>
                        <Button
                            bgColor={ showPassword ? `grey` : `grey` }
                            h={ '100%' }
                            size={ 'sm' }
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

            <Button
                colorScheme="blue"
                width="100%"
                style={ { marginTop: 15 } }
                onClick={ submitHandler }
                isLoading={ loading }
            >
                Login
            </Button>


            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={ () => {
                    setEmail( "guest@example.com" );
                    setPassword( "password1234" );
                } }
            >
                Log In As Guest
            </Button>

        </VStack>
    );
}

export default Login
