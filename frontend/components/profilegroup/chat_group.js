import styles from "../../styles/modules/profile-group.module.css";
import Discussion from "./discussions";

export default function ChatGroup() {
  return (
    <>
      <Discussion />
      <ChatContainer />
    </>
  );
}

export function ChatContainer() {
  return (
    <div className={styles.containerChatGroup}>
      <ChatHeader />
      <hr />
      <ChatBody />
      <ChatFooter />
    </div>
  );
}

export function ChatHeader() {
  
  return (
    <div className={styles.chatHeader}>
      <h3>Démarches Visa depuis le Sénégal</h3>
      <i className="fa-regular fa-circle-xmark" title="Close chat"></i>
    </div>
  );
}

export function ChatBody() {
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
            <pre>{item.content}</pre>
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

export function ChatFooter() {
  return (
    <div className={styles.chatFooter}>
      <textarea
        required=""
        placeholder="Message..."
        type="text"
        id={styles.messageInput2}
      ></textarea>
      <div className={styles.emoji}>😄</div>
      <button id={styles.sendButton2}>
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
    </div>
  );
}
