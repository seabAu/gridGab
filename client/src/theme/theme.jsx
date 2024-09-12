import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers( menuAnatomy.keys )

// define the base component styles
const baseStyle = definePartsStyle( {
    // define the part you're going to style
    
    button: {
        // this will style the MenuButton component
        fontWeight: 'medium',
        // bg: 'teal.500',
        color: 'gray.200',
        _hover: {
            bg: 'teal.600',
            color: 'white',
        },
    },
    list: {
        // this will style the MenuList component
        py: '4',
        borderRadius: 'xl',
        border: 'none',
        bg: 'teal.500',
    },
    item: {
        // this will style the MenuItem and MenuItemOption components
        color: 'gray.200',
        _hover: {
            bg: 'teal.600',
        },
        _focus: {
            bg: 'teal.600',
        },
    },
    groupTitle: {
        // this will style the text defined by the title prop
        // in the MenuGroup and MenuOptionGroup components
        textTransform: 'uppercase',
        color: 'white',
        textAlign: 'center',
        letterSpacing: 'wider',
        opacity: '0.7',
    },
    command: {
        // this will style the text defined by the command
        // prop in the MenuItem and MenuItemOption components
        opacity: '0.8',
        fontFamily: 'mono',
        fontSize: 'sm',
        letterSpacing: 'tighter',
        pl: '4',
    },
    divider: {
        // this will style the MenuDivider component
        my: '4',
        borderColor: 'white',
        borderBottom: '2px dotted',
    },
} )
// export the base styles in the component theme
export const menuTheme = defineMultiStyleConfig( { baseStyle } )


/*
    import { extendTheme } from '@chakra-ui/react';

    const lightTheme = extendTheme({
        colors: {
            primary: '#7FC2C2',
            secondary: '#E1774B',
            tertiary: '#F4DB60',
        },
        config: {
            initialColorMode: 'light',
        },
    });

    const darkTheme = extendTheme({
        colors: {
            primary: '#000000',
            secondary: '#989C94',
            tertiary: '#C21515',
        },
        config: {
            initialColorMode: 'dark',
        },
    });

    const purpleTheme = extendTheme({
        colors: {
            primary: '#b00b45',
            secondary: '#800845',
            tertiary: '#567882',
        },
        config: {
            initialColorMode: 'light',
        },
    });

    export default { lightTheme, darkTheme, purpleTheme };
*/