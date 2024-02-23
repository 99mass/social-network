import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
import { getDatasAutherUserInfos } from "../../handler/getAutherUserInfos";

export default function DiscussionPage() {
  const [datasUser, setDatasUser] = useState(null);
  const [datasUser2, setDatasUser2] = useState(null);

  const [emoji, setEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [socket, setSocket] = useState(null);
  const [socketDiscussion, setSocketDiscussion] = useState(null);
  const [messages, setMessages] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [error, setError] = useState(false);

  const router = useRouter();
  const { userid } = router.query;
  const userIdConnect = datasUser?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      await getUserBySession(setDatasUser);
      await getDatasAutherUserInfos(userid, setDatasUser2);
    };
    fetchUserData();

    const timer = setTimeout(() => {
      globalSocket(setSocket);
      allDiscussionPrivateSocket(setSocketDiscussion);
    }, 800);

    return () => clearTimeout(timer); // Nettoyage du timer pour éviter les appels inutiles
  }, []);

  // socket message
  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket privateMessage opened");
    };

    socket.onmessage = (event) => {
      const _message = JSON.parse(event.data);
      if (_message && _message.type === "error") {
        errorNotification(_message.content);
      }
      if (_message && _message.type === "message") {
        setMessages(_message.content);
        allDiscussionPrivateSocket(setSocketDiscussion); //actualiser les anciennes messages
      }
    };
  }, [socket]);

  // socket old message
  useEffect(() => {
    if (!socketDiscussion) return;

    socketDiscussion.onopen = () => {
      console.log("WebSocket discussion opened ");
      if (userid) {
        socketDiscussion.send(
          JSON.stringify({ User2: userid && userid.trim() })
        );
      }
    };

    socketDiscussion.onmessage = (event) => {
      const _discussions = JSON.parse(event.data);
      if (_discussions && _discussions.type === "error") {
        setError(true);
      } else {
        getDatasAutherUserInfos(userid && userid, setDatasUser2);
        setDiscussions(_discussions);
        setError(false);
      }
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
    allDiscussionPrivateSocket(setSocketDiscussion); //actualiser les anciennes messages
  };

  const toggleEmojicon = () => setEmoji(!emoji);

  return (
    <>
      {error || !datasUser || !datasUser2 ? (
        <Error />
      ) : (
        <div className={styles.middleBloc}>
          <div className={styles.receiver}>
            <Link href="/chat">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <Link href={`./profileuser?userid=${datasUser2?.id}`}>
              <img
                src={
                  datasUser2?.avatarpath
                    ? `data:image/png;base64,${datasUser2?.avatarpath}`
                    : "../images/user-circle.png"
                }
                alt=""
              />
            </Link>
            <p>{`${datasUser2?.firstname} ${datasUser2?.lastname}`}</p>
          </div>

          {!error && (
            <ContentMessage
              discussions={discussions}
              senderId={userIdConnect}
              userImage={datasUser2?.avatarpath}
            />
          )}

          {!error && (
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
          )}
        </div>
      )}
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
  const endOfMessagesRef = useRef(null);
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [discussions]);
  return (
    <div className={styles.containerChatMessage}>
      {discussions &&
        discussions.map((item, index) =>
          item.Recipient === senderId ? (
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
      <span ref={endOfMessagesRef} />
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
export function Error() {
  return (
    <div className="pemission-bloc">
      <img src="../images/permissions_dark_mode.svg" alt="" />
      <h3>This content isn't available right now</h3>
      <p>
        When this happens, it's usually because the user with you want to
        discuss doesn't exist.
      </p>
    </div>
  );
}
