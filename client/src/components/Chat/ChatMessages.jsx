import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../../config/ChatLogic";
import { ChatState } from "../../context/ChatProvider";

const ChatMessages = ( { messages } ) => {

    const { user } = ChatState();

    return (
        <ScrollableFeed>
            { messages &&
                messages.map( ( m, i ) => {
                    let sameUser = isSameUser( messages, m, i, user._id );
                    let sameSender = isSameUser( messages, m, i, user._id );
                    let isLastMessageFromSender = isLastMessage( messages, i, user._id );
                    return (
                        <div style={ {
                            display: "flex",
                            flexDirection: `${ user._id === m.sender._id ? 'row-reverse' : 'row' }`,
                            // marginLeft: isSameSenderMargin( messages, m, i, user._id ),
                            paddingLeft: `${ !sameSender ? 33 : 0 }px`,
                            paddingRight: `${ sameSender ? 0 : 33 }px`,
                            marginTop: sameUser ? 3 : 10,
                        } } key={ m._id }>
                            { ( sameSender ||
                                isLastMessageFromSender ) && (
                                    <Tooltip label={ m.sender.name } placement="bottom-start" hasArrow>
                                        <Avatar
                                            mt="7px"
                                            mr={ 1 }
                                            size="sm"
                                            cursor="pointer"
                                            name={ m.sender.name }
                                            src={ m.sender.avatar }
                                        />
                                    </Tooltip>
                                ) }
                            <span
                                style={ {
                                    backgroundColor: `${ m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                        }`,
                                    borderRadius: "10px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    color: `#333333`,
                                    fontWeight: `500`,

                                } }
                            >
                                { m.content }
                            </span>
                        </div>
                    );
                } ) }
        </ScrollableFeed>
    );
}

export default ChatMessages
