import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = ( { lineCount = 10 } ) => {
    
    const makeSkeletons = () => {
        let result = [];
        let i = 0;
        for ( i = 0; i < lineCount; i++ ) {
            result.push(
                <Skeleton height="45px" />
            );
        }
        return (
            <>
            { result }
            </>
        );
    }

    return (
        <Stack>
            {
                makeSkeletons()
            }
        </Stack>
    );
};

export default ChatLoading;