import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/modules/discussion.module.css";
import { getUserBySession } from "../../handler/getUserBySession";
import {
  globalSocket,
  allDiscussionPrivateSocket,
} from "../websocket/globalSocket";
import EmojiForm from "../emoji/emoji";
import { errorNotification } from "../../utils/sweeAlert";
import { getElapsedTime } from "../../utils/convert_dates";

export default function DiscussionPage() {
  const [datasUser, setDatasUser] = useState(null);
  const [emoji, setEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [socket, setSocket] = useState(null);
  const [socketDiscussion, setSocketDiscussion] = useState(null);
  const [messages, setMessages] = useState(null);
  const [discussions, setDiscussions] = useState([]);

  const router = useRouter();
  const { userid } = router.query;
  const userIdConnect = datasUser?.id;

  useEffect(() => {
    getUserBySession(setDatasUser);
    const timer = setTimeout(() => {
      globalSocket(setSocket);
      allDiscussionPrivateSocket(setSocketDiscussion);
      console.log("aaaa");
    }, 800);

    // Nettoyage du timer pour éviter les appels inutiles
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket privateMessage connection opened from chatpage ");
    };
    socket.onmessage = (event) => {
      const _message = JSON.parse(event.data);
      if (_message.type === "message") {
        setMessages(_message.content);
        allDiscussionPrivateSocket(setSocketDiscussion); //actualiser les ancienne messages
        console.log(messages);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!socketDiscussion) return;

    socketDiscussion.onopen = () => {
      console.log("WebSocket discussion connection opened from chatpage ");
      if (userid) {
        socketDiscussion.send(
          JSON.stringify({ User2: userid && userid.trim() })
        );
      }
    };

    socketDiscussion.onmessage = (event) => {
      const _discussions = JSON.parse(event.data);
      setDiscussions(_discussions);
    };
  }, [socketDiscussion, userIdConnect, userid]);

  const handlerSendMessage = (e) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket connection not open.");
      return;
    }

    const dataFrom = new FormData(e.target);
    const content = dataFrom.get("content");
    if (content.trim() == "") {
      errorNotification("Content can not be empty.");
      return;
    }
    const data = {
      sender_id: userIdConnect,
      recipient_id: userid,
      content: content,
    };

    socket.send(JSON.stringify(data));
    allDiscussionPrivateSocket(setSocketDiscussion); //actualiser les ancienne messages
  };

  const toggleEmojicon = () => setEmoji(!emoji);

  return (
    <>
      <div className={styles.middleBloc}>
        <div className={styles.receiver}>
          <Link href="./chat">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <Link href={`./profileuser?userid=${datasUser?.id}`}>
            <img
              src={
                datasUser?.avatarpath
                  ? `data:image/png;base64,${datasUser?.avatarpath}`
                  : "../images/user-circle.png"
              }
              alt=""
            />
          </Link>
          <p>{`${datasUser?.firstname} ${datasUser?.lastname}`}</p>
        </div>

        <ContentMessage
          discussions={discussions}
          senderId={userIdConnect}
          userImage={datasUser?.avatarpath}
        />

        <div className={styles.contentFromChat}>
          <form method="post" onSubmit={handlerSendMessage}>
            <textarea
              value={selectedEmoji}
              name="content"
              onChange={(e) => setSelectedEmoji(e.target.value)}
              placeholder="Type..."
            />
            <div onClick={toggleEmojicon} className={styles.emoji}>
              😄
            </div>
            <button type="submit">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
      {/* emoji form */}
      {emoji && (
        <EmojiForm
          toggleEmojicon={toggleEmojicon}
          setSelectedEmoji={setSelectedEmoji}
        />
      )}
    </>
  );
}

export function ContentMessage({ discussions, senderId, userImage }) {
  return (
    <div className={styles.containerChatMessage}>
      {discussions &&
        discussions.map((item, index) =>
          item.Sender === senderId ? (
            <MessageReceiver
              key={index}
              userImage={userImage}
              text={item.Message}
              time={item.Created}
            />
          ) : (
            <MessageSender
              key={index}
              text={item.Message}
              time={item.Created}
            />
          )
        )}
    </div>
  );
}

export function MessageReceiver({ userImage, text, time }) {
  return (
    <div className={styles.contentMesReceiver}>
      <div>
        <span>
          <img
            src={
              userImage
                ? `data:image/png;base64,${userImage}`
                : "../images/user-circle.png"
            }
            alt=""
          />
        </span>
        <pre className={styles.messageReceiver}>{text}</pre>
      </div>
      <p>
        {`${getElapsedTime(time).value} ${getElapsedTime(time).unit} ago`}
        <i className="fa-solid fa-check-double"></i>
      </p>
    </div>
  );
}
export function MessageSender({ text, time }) {
  return (
    <div className={styles.contentMesSender}>
      <pre className={styles.messageSender}>{text}</pre>
      <p>
        {`${getElapsedTime(time).value} ${getElapsedTime(time).unit} ago`}
        <i className="fa-solid fa-check-double"></i>
      </p>
    </div>
  );
}
