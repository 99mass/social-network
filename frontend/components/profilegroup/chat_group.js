import { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/profile-group.module.css";
import { allDiscussionGroupPrivateSocket } from "../websocket/globalSocket";
import Discussion from "./discussions";
import { errorNotification } from "../../utils/sweeAlert";
import EmojiForm from "../emoji/emoji";
import { getElapsedTime } from "../../utils/convert_dates";
import { getUserBySession } from "../../handler/getUserBySession";

export default function ChatGroup({ setSection, groupName, group_id }) {
  return (
    <>
      <Discussion />
      <ChatContainer setSection={setSection} groupName={groupName} group_id={group_id} />
    </>
  );
}

export function ChatContainer({ setSection, groupName, group_id }) {

  const [dataUserConected, setDataUserConnected] = useState(null)
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(null);


  useEffect(() => {
    getUserBySession(setDataUserConnected);
    const timer = setTimeout(() => {
      allDiscussionGroupPrivateSocket(setSocket);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket group opened.");
      socket.send(JSON.stringify({ group_id: group_id.trim() }))
    };

    socket.onmessage = (event) => {
      const _message = event.data && JSON.parse(event.data);
      if (!_message) return;
      // console.log("mess:", _message);
      setMessages(_message)
    }
  }, [socket]);



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
      group_id: group_id,
      content: content,
    }

    socket.send(JSON.stringify(data));
    allDiscussionGroupPrivateSocket(setSocket); //actualiser les anciennes messages
  };

  return (
    <div className={styles.containerChatGroup}>
      <ChatHeader setSection={setSection} groupName={groupName} />
      <hr />
      <ChatBody messages={messages} userId={dataUserConected?.id} group_id={group_id} />
      <ChatFooter group_id={group_id} handlerSendMessage={handlerSendMessage} />
    </div>
  );
}

export function ChatHeader({ setSection, groupName }) {
  const toggleChat = () => {
    setSection({
      section1: true,
      section2: false,
      section3: false,
      section4: false,
      section5: false,
    });
  };

  return (
    <div className={styles.chatHeader}>
      <h3>{groupName}</h3>
      <i
        onClick={toggleChat}
        className={`${styles.closeChatGroup} fa-regular fa-circle-xmark`}
        title="Close chat"
      ></i>
    </div>
  );
}

export function ChatBody({ messages, userId, group_id }) {

  const endOfMessagesRef = useRef(null);
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles.chatBody}>
      {messages && messages.content ? messages.content.map((item, index) => (
        <div key={`${item.message.id}${index}`} className={styles.contentMess}>
          <img src={item.user.avatarpath ? `data:image/png;base64,${item.user.avatarpath} ` : "../images/default-image.svg"} alt="" />
          <div>
            <pre className={item.user.id == userId ? styles.specifyBG : ""}>{item.message.content}</pre>
            <p>
              <span>by {`${item.user.firstname} ${item.user.lastname}`}</span>
              {`${getElapsedTime(item.message.created_at).value} ${getElapsedTime(item.message.created_at).unit} ago`}
            </p>
          </div>
        </div>
      )) : <p className="emptyDisc"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.7914 13.3425C17.5722 13.0693 18.5428 13.0325 20.5715 13.0278H21.9969C21.9902 13.1251 22.0065 12.9312 21.9969 13.0278C21.9657 13.3707 21.8157 13.692 21.5728 13.9361L13.9223 21.6251C13.6855 21.8631 13.3635 21.9969 13.0278 21.9969C12.9312 22.0065 13.1251 21.9902 13.0278 21.9969V20.5715C13.0325 18.5428 13.0693 17.5722 13.3425 16.7914C13.9075 15.1769 15.1769 13.9075 16.7914 13.3425Z" fill="gray"></path> <path opacity="0.5" d="M13.0278 21.9478C12.6899 21.9823 12.347 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.347 21.9823 12.6899 21.9478 13.0278H20.5715C18.5428 13.0325 17.5722 13.0693 16.7914 13.3425C15.1769 13.9075 13.9075 15.1769 13.3425 16.7914C13.0693 17.5722 13.0325 18.5428 13.0278 20.5715V21.9478Z" fill="gray"></path> <path d="M14.8978 11.2237C15.4313 11.0808 15.6899 10.3162 15.4755 9.51599C15.2611 8.71579 14.6548 8.18298 14.1213 8.32592C13.5879 8.46886 13.3292 9.23343 13.5436 10.0336C13.7581 10.8338 14.3643 11.3666 14.8978 11.2237Z" fill="#1C274C"></path> <path d="M9.10238 12.7767C9.63585 12.6337 9.89449 11.8692 9.68008 11.069C9.46567 10.2688 8.85939 9.73596 8.32592 9.8789C7.79246 10.0218 7.53381 10.7864 7.74823 11.5866C7.96264 12.3868 8.56892 12.9196 9.10238 12.7767Z" fill="#1C274C"></path> <path d="M9.09507 15.2059C8.69329 15.1052 8.28594 15.3492 8.18524 15.751C8.08453 16.1528 8.32861 16.5602 8.73039 16.6609C10.1168 17.0083 11.674 17.0052 13.2294 16.5885L13.2819 16.5742L13.3618 16.7371C13.936 15.1484 15.195 13.9011 16.7914 13.3425C16.8842 13.31 16.9797 13.2809 17.0794 13.2548C16.7902 13.0454 16.3839 13.067 16.1185 13.324C15.2813 14.1345 14.1589 14.7865 12.8411 15.1396C11.5234 15.4927 10.2254 15.4892 9.09507 15.2059Z" fill="#1C274C"></path> </g></svg>no message yet be the first to start the discussion</p>}
      <span ref={endOfMessagesRef} />
    </div>
  );
}

export function ChatFooter({ handlerSendMessage }) {

  const [emoji, setEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const toggleEmojicon = () => setEmoji(!emoji);

  return (
    <>
      <form method="post" onSubmit={handlerSendMessage} className={styles.chatFooter}>
        <textarea
          value={selectedEmoji}
          name="content"
          onChange={(e) => setSelectedEmoji(e.target.value)}
          placeholder="Message..."
          id={styles.messageInput2}
        />

        <div onClick={toggleEmojicon} className={styles.emoji}>😄</div>
        <button id={styles.sendButton2} type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 664 663"
          >
            <path
              fill="none"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="33.67"
              stroke="#6c6c6c"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
          </svg>
        </button>
      </form>
      {/* emoji form */}
      {emoji && (
        <EmojiForm
          toggleEmojicon={toggleEmojicon}
          setSelectedEmoji={setSelectedEmoji}
        />
      )}</>
  );
}
