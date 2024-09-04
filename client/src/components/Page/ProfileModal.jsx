import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Image,
    Text,
    IconButton,
} from '@chakra-ui/react'
import { useRef } from 'preact/hooks';
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ( { user, children } ) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = useRef( null );

    return (
        <>
            { children ? (
                <span onClick={ onOpen }>{ children }</span>
            ) : (
                <IconButton d={ { base: "flex" } } icon={ <ViewIcon /> } onClick={ onOpen } />
            ) }
            <Modal
                isCentered
                // blockScrollOnMount={ false }
                isOpen={ isOpen }
                onClose={ onClose }
                // motionPreset='slideInBottom'
                size={ 'lg' }
                scrollBehavior={ 'inside' }
            >
                <ModalOverlay
                    // bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                // backdropFilter='auto'
                // backdropInvert='80%'
                // backdropBlur='2px'
                />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >
                        { user ? user.name : '' }
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={ user ? user.avatar : '' }
                            alt={ user ? user.name : '' }
                        />
                        <Text
                            fontSize={ { base: "28px", md: "30px" } }
                            fontFamily="Work sans"
                        >
                            Email: { user ? user.email : '' }
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={ onClose }>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProfileModal;