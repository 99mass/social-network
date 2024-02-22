import { domainSocket } from "../../utils/api";
import { getSessionCookie } from "../../utils/cookies";

export function globalSocket(setSocket) {
    const sessionId = getSessionCookie();
     const private_message=  new WebSocket(`${domainSocket}/global_socket?Authorization=${sessionId}`);
     setSocket(private_message)
}

export function allDiscussionPrivateSocket(setSocketDiscussion) {
    const sessionId = getSessionCookie();
     const discussions=  new WebSocket(`${domainSocket}/discussion?Authorization=${sessionId}`);
     setSocketDiscussion(discussions)
}



    // const ws = new WebSocket(`${domainSocket}/private_message?Authorization=${sessionId}`);
    // // socket ouvert

    // socket message
    // ws.onmessage = (event) => {
    //   console.log("Received message:", event.data);
    //   setMessages((prevMessages) => [...prevMessages, event.data]);
    // };
    //   socket fermer
    // ws.onclose = () => {
    //   console.log("WebSocket connection closed");
    // };

    // return () => {
    //   ws.close();
    // };