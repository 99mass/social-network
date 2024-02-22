import { useEffect, useState } from "react";
import LeftBloc from "./left_bloc";
import MidlleBloc from "./middle_bloc";
import RightBloc from "./rigthB_bloc";
import { getUserBySession } from "../../handler/getUserBySession";
import { globalSocket } from "../websocket/privateMessage";

export default function PageHome() {
  const [datasUser, setDatasUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [socket, setSocket] = useState(null);

  const [FriendsList, setFriendsList] = useState(null);


  useEffect(() => {
      getUserBySession(setDatasUser);
      globalSocket(setSocket);
  }, []);

  if (socket) {
    socket.onopen = () => {
      console.log("WebSocket connection opened from Home page");
    };

    socket.onmessage =(event)=>{
      console.log("onmessage");
      const data = JSON.parse(event.data)
      console.log(data);
      if (data.type === "users_list") {
        setFriendsList(data.content);
      }
    }
  }

  return (
    <>
      <LeftBloc setPosts={setPosts} />
      <MidlleBloc posts={posts} setPosts={setPosts} />
      <RightBloc datasUser={datasUser && datasUser} FriendsList={FriendsList}/>
    </>
  );
}
