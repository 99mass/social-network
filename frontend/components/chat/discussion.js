import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/modules/discussion.module.css";
import { getUserBySession } from "../../handler/getUserBySession";
import { getSessionCookie } from "../../utils/cookies";

export default function DiscussionPage() {
  const [datasUser, setDatasUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const { userid } = router.query;
  

  useEffect(() => {
    getUserBySession(setDatasUser);

    // const ws = new WebSocket(`${domainSocket}/private_message?Authorization=${sessionId}`);
    // // socket ouvert
    socketPrivateMessage.onopen = () => {
      console.log("WebSocket connection opened");
    };
    // socket message
    // ws.onmessage = (event) => {
    //   console.log("Received message:", event.data);
    //   setMessages((prevMessages) => [...prevMessages, event.data]);
    // };
    //   socket fermer
    // ws.onclose = () => {
    //   console.log("WebSocket connection closed");
    // };

    // return () => {
    //   ws.close();
    // };
  }, []);
  
  const userIdConnect = datasUser?.id;

  return (
    <div className={styles.middleBloc}>
      <div className={styles.receiver}>
        <Link href="./chat">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <Link href={`./profileuser?userid=`}>
          <img
            src="https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM="
            alt=""
          />
        </Link>
        <p>breukh</p>
      </div>

      <ContentMessage />

      <div className={styles.contentFromChat}>
        <form action="#" method="post">
          <textarea name="message" placeholder="Type..."></textarea>
          <div className={styles.emoji}>😄</div>
          <button type="submit">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export function ContentMessage() {
  const data = [
    {
      image:
        "https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM=",
      text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
      time: "1days ago",
    },
    {
      image: "",
      text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
      time: "1days ago",
    },
    {
      image: "",
      text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
      time: "1days ago",
    },
    {
      image:
        "https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM=",
      text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
      time: "1days ago",
    },
    {
      image: "",
      text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
      time: "1days ago",
    },
    {
      image:
        "https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM=",
      text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
      time: "1days ago",
    },
    {
      image:
        "https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM=",
      text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
      time: "1days ago",
    },
  ];
  return (
    <div className={styles.containerChatMessage}>
      {data.map((item, index) =>
        item.image != "" ? (
          <MessageReceiver
            key={index}
            image={item.image}
            text={item.text}
            time={item.time}
          />
        ) : (
          <MessageSender key={index} text={item.text} time={item.time} />
        )
      )}
    </div>
  );
}

export function MessageReceiver({ image, text, time }) {
  return (
    <div className={styles.contentMesReceiver}>
      <div>
        <Link href={`./profileuser?userid=`}>
          <img src={"" + image} alt="" />
        </Link>
        <pre className={styles.messageReceiver}>{text}</pre>
      </div>
      <p>
        {time}
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
        {time}
        <i className="fa-solid fa-check-double"></i>
      </p>
    </div>
  );
}
