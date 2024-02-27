import { useEffect, useState } from "react";
import styles from "../../styles/modules/profile-group.module.css";
import { allDiscussionGroupPrivateSocket } from "../websocket/globalSocket";
import Discussion from "./discussions";
import { errorNotification } from "../../utils/sweeAlert";
import EmojiForm from "../emoji/emoji";

export default function ChatGroup({ setSection, groupName, group_id }) {
  return (
    <>
      <Discussion />
      <ChatContainer setSection={setSection} groupName={groupName} group_id={group_id} />
    </>
  );
}

export function ChatContainer({ setSection, groupName, group_id }) {

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      allDiscussionGroupPrivateSocket(setSocket);
    }, 800);

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
      console.log("mess:", _message);
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
    };
    console.log("aaaa", data);


    socket.send(JSON.stringify(data));
    allDiscussionGroupPrivateSocket(setSocket); //actualiser les anciennes messages
  };

  return (
    <div className={styles.containerChatGroup}>
      <ChatHeader setSection={setSection} groupName={groupName} />
      <hr />
      <ChatBody messages={messages} />
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

export function ChatBody({messages}) {



  const data = [
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "jack",
      time: "10m ago",
    },
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "paul",
      time: "5m ago",
    },
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "breukh",
      time: "2m ago",
    },
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "breukh",
      time: "2m ago",
    },
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "breukh",
      time: "2m ago",
    },
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "breukh",
      time: "2m ago",
    },
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "breukh",
      time: "2m ago",
    },
    {
      image: "../images/default-image.svg",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      user: "breukh",
      time: "2m ago",
    },
  ];

  return (
    <div className={styles.chatBody}>
      {data.map((item, index) => (
        <div key={index} className={styles.contentMess}>
          <img src={item.image} alt="" />
          <div>
            <pre className={styles.specifyBG}>{item.content}</pre>
            <p>
              <span>by {item.user}</span>
              {item.time}
            </p>
          </div>
        </div>
      ))}
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
