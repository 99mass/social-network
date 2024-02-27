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
      const _message = event.data && JSON.parse(event.data);
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
      {discussions ?
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
        ) : <p className="emptyDisc"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.7914 13.3425C17.5722 13.0693 18.5428 13.0325 20.5715 13.0278H21.9969C21.9902 13.1251 22.0065 12.9312 21.9969 13.0278C21.9657 13.3707 21.8157 13.692 21.5728 13.9361L13.9223 21.6251C13.6855 21.8631 13.3635 21.9969 13.0278 21.9969C12.9312 22.0065 13.1251 21.9902 13.0278 21.9969V20.5715C13.0325 18.5428 13.0693 17.5722 13.3425 16.7914C13.9075 15.1769 15.1769 13.9075 16.7914 13.3425Z" fill="gray"></path> <path opacity="0.5" d="M13.0278 21.9478C12.6899 21.9823 12.347 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.347 21.9823 12.6899 21.9478 13.0278H20.5715C18.5428 13.0325 17.5722 13.0693 16.7914 13.3425C15.1769 13.9075 13.9075 15.1769 13.3425 16.7914C13.0693 17.5722 13.0325 18.5428 13.0278 20.5715V21.9478Z" fill="gray"></path> <path d="M14.8978 11.2237C15.4313 11.0808 15.6899 10.3162 15.4755 9.51599C15.2611 8.71579 14.6548 8.18298 14.1213 8.32592C13.5879 8.46886 13.3292 9.23343 13.5436 10.0336C13.7581 10.8338 14.3643 11.3666 14.8978 11.2237Z" fill="#1C274C"></path> <path d="M9.10238 12.7767C9.63585 12.6337 9.89449 11.8692 9.68008 11.069C9.46567 10.2688 8.85939 9.73596 8.32592 9.8789C7.79246 10.0218 7.53381 10.7864 7.74823 11.5866C7.96264 12.3868 8.56892 12.9196 9.10238 12.7767Z" fill="#1C274C"></path> <path d="M9.09507 15.2059C8.69329 15.1052 8.28594 15.3492 8.18524 15.751C8.08453 16.1528 8.32861 16.5602 8.73039 16.6609C10.1168 17.0083 11.674 17.0052 13.2294 16.5885L13.2819 16.5742L13.3618 16.7371C13.936 15.1484 15.195 13.9011 16.7914 13.3425C16.8842 13.31 16.9797 13.2809 17.0794 13.2548C16.7902 13.0454 16.3839 13.067 16.1185 13.324C15.2813 14.1345 14.1589 14.7865 12.8411 15.1396C11.5234 15.4927 10.2254 15.4892 9.09507 15.2059Z" fill="#1C274C"></path> </g></svg>no message yet be the first to start the discussion</p>}
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
