import { useEffect, useState } from "react";
import LeftBloc from "./left_bloc";
import MidlleBloc from "./middle_bloc";
import RightBloc from "./rigthB_bloc";
import { getUserBySession } from "../../handler/getUserBySession";
import { socketPrivateMessage } from "../websocket/privateMessage";

export default function PageHome() {
  const [datasUser, setDatasUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
      getUserBySession(setDatasUser);
      socketPrivateMessage(setSocket);
  }, []);
  
  if (socket) {
    socket.onopen = () => {
      console.log("WebSocket connection opened from Home page");
    };
  }

  return (
    <>
      <LeftBloc setPosts={setPosts} />
      <MidlleBloc posts={posts} setPosts={setPosts} />
      <RightBloc datasUser={datasUser && datasUser} />
    </>
  );
}
