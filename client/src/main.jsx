import { render } from 'preact'
import { App } from './app.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './context/ChatProvider.jsx';

// Set styling based on dark/light mode.
const styles = {
    global: (props) => ({
        body: {
            // Each one is a linear list for each color mode.
            color: mode('gray.800', 'whiteAlpha.900', '#800845')(props),
            bg: mode('gray.100', '#101010', '#800845')(props)
        },
        div: {
            color: mode( '#101010', 'gray.100', '#800845' )( props ),
            // borderRadius: "sm"
        },
        p: {
            color: mode( '#101010', 'gray.100', '#800845')(props)
        }
    })
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true
};

const colors = {
    gray: {
        light: '#616161',
        dark: '#1e1e1e',
        purple: '#800845'
    }
}

const theme = extendTheme({config, styles, colors});

render(
    <ChakraProvider theme={ theme }>
        <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
        <BrowserRouter>
            <ChatProvider>
                <App />
            </ChatProvider>
        </BrowserRouter>
    </ChakraProvider>
    ,
    document.getElementById( 'app' )
);
