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
  const [userIdConnect, setUserIdConnect] = useState("");

  const [messages, setMessages] = useState(null);
  const [discussions, setDiscussions] = useState([]);

  const router = useRouter();
  const { userid } = router.query;

  useEffect(() => {
    getUserBySession(setDatasUser);
    globalSocket(setSocket);
    allDiscussionPrivateSocket(setSocketDiscussion);
    if (datasUser) {
      setUserIdConnect(datasUser.id);
    }
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
      }
    };
    //   console.log("Received message:", messages);
  }, [socket]);
  console.log("user 2", userid && userid);
  useEffect(() => {
    if (!socketDiscussion) return;
    socketDiscussion.onopen = () => {
      console.log("WebSocket discussion connection opened from chatpage ");

      if (userIdConnect) {
        socketDiscussion.send(
          JSON.stringify({  User2: userid.trim() })
        );
        console.log("user 1", userIdConnect && userIdConnect.trim());
      }
    };

    socketDiscussion.onmessage = (event) => {
      const _discussions = JSON.parse(event.data);
      console.log(_discussions);
      setDiscussions(_discussions);
    };
    console.log("Received message:", discussions);
  }, [socketDiscussion]);

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
          recipientId={userid}
          userImage={datasUser?.avatarpath}
          messageTempReel={messages}
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

export function ContentMessage({
  discussions,
  senderId,
  recipientId,
  userImage,
  messageTempReel,
}) {
  const data = [
    {
      sender_id: "66a27f55-eb08-48ab-9a84-5988bb89d117",
      recipient_id: "2fa8be74-d97f-4063-98b6-13eb226b4e9b",
      content: "test1",
      created_at: "2024-02-22 16:45:38",
    },
    {
      sender_id: "66a27f55-eb08-48ab-9a84-5988bb89d117",
      recipient_id: "2fa8be74-d97f-4063-98b6-13eb226b4e9b",
      content: "test2",
      created_at: "2024-02-22 16:45:38",
    },
    {
      recipient_id: "66a27f55-eb08-48ab-9a84-5988bb89d117",
      sender_id: "2fa8be74-d97f-4063-98b6-13eb226b4e9b",
      content: "test3",
      created_at: "2024-02-22 16:45:38",
    },
    {
      recipient_id: "66a27f55-eb08-48ab-9a84-5988bb89d117",
      sender_id: "2fa8be74-d97f-4063-98b6-13eb226b4e9b",
      content: "test4",
      created_at: "2024-02-22 16:45:38",
    },
  ];
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
      {/* {messageTempReel && messageTempReel.sender_id == senderId && (
        <MessageReceiver
          userImage={userImage}
          text={messageTempReel.content}
          time={messageTempReel.created_at}
        />
      )}
      {messageTempReel && messageTempReel.sender_id == recipientId && (
        <MessageSender
          text={messageTempReel.content}
          time={messageTempReel.created_at}
        />
      )} */}
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
