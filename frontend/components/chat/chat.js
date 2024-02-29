import Link from "next/link";
import styles from "../../styles/modules/Chat.module.css";
import { useEffect, useState } from "react";
import { getUserBySession } from "../../handler/getUserBySession";
import {
  globalSocket,
  recentDiscussionsSocket,
} from "../websocket/globalSocket";

export default function ListUser() {
  const [datasUser, setDatasUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketRecentDiscussion, setSocketRecentDiscussion] = useState(null);
  const [messagesLists, setMessagesLists] = useState(null);

  const [FriendsOnLine, setFriendsOnLine] = useState([]);
  useEffect(() => {
    getUserBySession(setDatasUser);
    globalSocket(setSocket);
    recentDiscussionsSocket(setSocketRecentDiscussion);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onopen = () => {
      console.log("socket open chat ");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "users_list") {
        setFriendsOnLine(data.content);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!socketRecentDiscussion) return;
    socketRecentDiscussion.onopen = () => {
      console.log("WebSocket oldMessage opened");
    };

    socketRecentDiscussion.onmessage = (event) => {
      const _message = event.data && JSON.parse(event.data);
      console.log("old", _message);
      if (_message) {
        setMessagesLists(_message);
      }
    };
  }, [socketRecentDiscussion]);

  return (
    <div className={styles.middleBloc}>
      <h1>Messages</h1>
      <UserOnLine FriendsOnLine={FriendsOnLine} />

      <LastChatWitheAutherUser data={messagesLists} />
    </div>
  );
}

export function UserOnLine({ FriendsOnLine }) {
  return (
    <div className={styles.usersOnline}>
      <h5>users online now</h5>
      <div className={styles.listUsers}>
        {FriendsOnLine &&
          FriendsOnLine.map(
            (item, index) =>
              item.IsOnline && (
                <div key={`${item.id}${index}`}>
                  <Link href={`./chatpage?userid=${item.id}`}>
                    <img
                      src={
                        item.avatarpath
                          ? `data:image/png;base64,${item.avatarpath}`
                          : `../images/user-circle.png`
                      }
                      alt=""
                    />
                    <i className="fas fa-circle"></i>
                    <p>{item.firstname}</p>
                  </Link>
                </div>
              )
          )}
      </div>
    </div>
  );
}

export function LastChatWitheAutherUser({ data }) {
  return (
    <>
      {data &&
        data.map((item, index) => (
          <div key={`${item.other_user_id}${index}`} className={styles.user}>
            <Link href={`./chatpage?userid=${item.other_user_id}`}>
              <img
                src={
                  item.other_user_avatarpath
                    ? `data:image/png;base64,${item.other_user_avatarpath}`
                    : `../images/user-circle.png`
                }
                alt=""
              />
              <div>
                <p>{item.other_user_nickname}</p>
                <p>{item.last_message_content}</p>
              </div>
            </Link>
          </div>
        ))}
    </>
  );
}
