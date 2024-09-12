import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { ChatState } from "../../context/ChatProvider";
import * as util from 'akashatools';

const UserBadgeItem = ( {
    userData,
    handleFunction,
    closeFunction,
    admin,
    isUser = false
} ) => {

    return (
        <Badge
            px={ 2 }
            py={ 1 }
            borderRadius="lg"
            m={ 1 }
            mb={ 2 }
            variant="solid"
            fontSize={ 12 }
            colorScheme={ `${ isUser ? 'purple' : 'teal' }` }
            cursor="pointer"
            onClick={ handleFunction ? handleFunction : () => { } }
        >
            { userData.name }
            { admin === userData._id && <span> (Admin)</span> }
            <CloseIcon pl={ 1 } closeFunction={ closeFunction ? closeFunction : () => { } } />
        </Badge>
    );
};

export default UserBadgeItem;