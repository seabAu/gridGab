import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { ChatState } from "../../context/ChatProvider";

const UserBadgeItem = ( { user, handleFunction, admin, isUser=false } ) => {
    
    return (
        <Badge
            px={ 2 }
            py={ 1 }
            borderRadius="lg"
            m={ 1 }
            mb={ 2 }
            variant="solid"
            fontSize={ 12 }
            colorScheme={`${ isUser ? 'purple' : 'teal' }`}
            cursor="pointer"
            onClick={ handleFunction }
        >
            { user.name }
            { admin === user._id && <span> (Admin)</span> }
            <CloseIcon pl={ 1 } />
        </Badge>
    );
};

export default UserBadgeItem;