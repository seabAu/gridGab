import { render } from 'preact'
import { App } from './app.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './context/ChatProvider.jsx';
import theme from './theme/styles.jsx'

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
        list: {
            // this will style the MenuList component
            // py: '4',
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
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true
};

const colors = {
    gray: {
        light: '#616161',
        dark: '#1e1e1e'
    },
    violet: {
        light: '#ec0f7d',
        mid: '#800845',
        dark: '#300319',
        '100': '#483740',
        '200': '#eb4f9d',
        '500': '#800845',
        '800': '#3c0521',
        '900': '#1c0510',
    }
}

// const theme = extendTheme( { config, styles, colors } );

render(
    <ChakraProvider theme={ theme }>
        <ColorModeScript initialColorMode={ theme.config.initialColorMode } />
        <BrowserRouter>
            <ChatProvider>
                <App />
            </ChatProvider>
        </BrowserRouter>
    </ChakraProvider>
    ,
    document.getElementById( 'app' )
);
