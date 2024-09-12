import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers( menuAnatomy.keys )

import colors from './colors/colors.jsx';
import { mode } from '@chakra-ui/theme-tools'



// Set styling based on dark/light mode.
const styles = {
    global: ( props ) => ( {
        body: {
            // Each one is a linear list for each color mode.
            color: mode( 'gray.800', 'whiteAlpha.900', '#800845' )( props ),
            bg: mode( 'gray.200', 'gray.dark', '#800845' )( props ),
            // bg={ useColorModeValue( 'gray.200', 'gray.dark' ) }
        },
        div: {
            fontSize: 'sm',
            color: mode( '#101010', 'gray.100', '#800845' )( props ),
            // bg: mode( 'gray.200', 'gray.dark', '#800845' )( props ),
            gap: '0px',
            // borderRadius: "sm"
        },
        p: {
            fontFamily: 'mono',
            // letterSpacing: 'tighter',
            // color: mode( '#101010', 'gray.100', '#800845' )( props ),
            color: mode( 'gray.700', 'gray.300', 'violet.mid' )( props ),
            fontSize: 'sm',
            // fontSize: {
            //     base: '0.85em',
            //     md: '0.75em',
            // },
            fontFamily: 'Work sans',
            display: 'flex'
        },
        h1: {
            fontFamily: 'mono',
            fontSize: 'xl',
        },
        button: {
            // this will style the MenuButton component
            fontWeight: 'medium',
            // bg: 'teal.500',
            bg: mode( 'white', 'gray.dark' )( props ),
            color: mode( 'gray.800', 'gray.200' )( props ),
            _hover: {
                bg: mode( 'white', 'gray.dark' )( props ),
                color: mode( 'violet.dark', 'violet.light' )( props ),
            },
        },
        input: {
            bg: mode( 'gray.light', 'gray.dark' )( props ),
            color: mode( 'gray.800', 'gray.200' )( props ),
            _hover: {
                bg: mode( 'white', 'gray.dark' )( props ),
                color: mode( 'violet.dark', 'violet.light' )( props ),
            },
            p: '1',
            fontSize: '12px',
            size: 'xs'
        },
        list: {
            // this will style the MenuList component
            // py: '4',
            borderRadius: 'xl',
            border: 'none',
            bg: 'teal.500',
            size: 'xs'
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

        // overlay: {
        //     bg: 'blackAlpha.200', //change the background
        // },
        // dialog: {
        //     borderRadius: 'md',
        //     bg: `purple.100`,
        // },


    } )
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true
};


const theme = extendTheme( { config, styles, colors } );

export default theme;