import React from 'react'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Text,
    useColorMode,
    useColorModeValue,
    Image,
} from '@chakra-ui/react';


import logoDark from "../../assets/images/LogoDark.png";
import logoLight from "../../assets/images/LogoLight.png";

const Logo = () => {

    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            {
                // LOGO
            }
            <Box
                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                display={ 'flex' }
                flexDir={ 'row' }
                paddingInline={ '4px' }
                gap={ '8px' }
                alignItems="center"
                w={ 'auto' }
            >
                <Image
                    cursor={ "pointer" }
                    alt='logo'
                    w={ `${ 48 }px` }
                    src={ colorMode === 'dark'
                        ? logoLight
                        : logoDark }
                ></Image>

                <Text
                    fontSize={ "2xl" }
                    as={'b'}
                    fontFamily={ "Work sans" }
                    color={ useColorModeValue( 'gray.dark', 'white' ) }
                    display={ {
                        base: "none",
                        md: "flex"
                    } }
                >
                    gridGab
                </Text>
            </Box>

        </>
    )
}

export default Logo
