import React from 'react'
I don't know if you ever figured this out, but I ran into the same problem today, and here's how I resolved it with Chakra-UI. Create a separate function and write the logic like this...

import { useToast } from "@chakra-ui/react";
const Toast = ( props ) => {
    const {
        title = '',
        description = '',
        status = '',
        duration = 3000,
        isClosable = true,
        position = "bottom",

    } = props;
    const defaultToastProps = {
        position: "top-right" as ToastPosition,
        duration: 2000,
        isClosable: true,
    };

    
    const showToast = () => {
        toast( {
            title: "Hello, Toast!",
            description: "This is a simple toast message.",
            status: "success",
            duration: 3000, // Display duration in milliseconds
            isClosable: true, // Allow users to close the toast
        } );
    };
    return (
        <div>

        </div>
    )
}

export default Toast
