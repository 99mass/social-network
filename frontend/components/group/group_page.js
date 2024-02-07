import { FeedBloc } from "./feed_bloc";
import LeftBlocGroupPage from "./left_bloc";

export default function GroupPage(params) {
    return(
        <>
             <LeftBlocGroupPage/>
            <FeedBloc/>
        </>
    )
    
}