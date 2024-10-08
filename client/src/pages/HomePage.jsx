import React from 'react';
import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
    useColorMode,
} from '@chakra-ui/react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'preact/hooks';

const HomePage = ( props ) => {
    const {
        classes = '',
        styles = {}
    } = props;
    const { colorMode, toggleColorMode } = useColorMode();

    const navigate = useNavigate();

    useEffect( () => {
        const userInfo = JSON.parse(
            localStorage.getItem( "userInfo" )
        );

        if ( userInfo ) {
            // If user is logged in, send to chat page. 
            navigate( "/chat" );
        }
    }, [] );

    return (
        <Container
            maxW={ `xl` }
            centerContent>
            <Box
                d='flex'
                justifyContent='center'
                p={ 3 }
                w={ `100%` }
                m={ `40px 0px 15px 0px` }
                borderRadius={ `lg` }
                borderWidth={ `1px` }>
                <Text
                    fontSize={ `4xl` }
                    fontFamily={ `Work sans` }
                    color={ `black` }>
                    gridGab
                </Text>
            </Box>

            <Box
                w='100%'
                p={ 4 }
                borderRadius='lg'
                borderWidth='1px'>
                <Tabs
                    isFitted
                    variant='soft-rounded'
                >
                    <TabList mb='1em'>
                        <Tab>Login</Tab>
                        <Tab>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage;
