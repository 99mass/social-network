import styles from "../../styles/modules/profile-group.module.css";
import Discussion from "./discussions";

export default function ChatGroup() {


  return (
    <>
      <Discussion />
      <ChatContainer/>
    </>
  );
}


export function ChatContainer() {
  return (
    <div className={styles.containerChatGroup}>
      <div className={styles.chatHeader}>
        <h3>Démarches Visa depuis le Sénégal</h3>
        <i className="fa-regular fa-circle-xmark" title="Close chat"></i>
      </div>
      <hr />
      <div className={styles.chatBody}>
        <div className={styles.contentMess}>
          <img src="https://scontent.fdkr6-1.fna.fbcdn.net/v/t39.30808-6/313253877_10160642361074235_7947257140729249691_n.jpg?stp=dst-jpg_s960x960&_nc_cat=103&ccb=1-7&_nc_sid=173fa1&_nc_eui2=AeHS-pL8hG9404bzleqq3HoguhWiboypV-66FaJujKlX7opVFmohOdQkhqcVwsX1KuJG9AiyGlkJhL_Qb9wmvvRZ&_nc_ohc=WPoRNWoiJokAX-ItpOM&_nc_ht=scontent.fdkr6-1.fna&oh=00_AfDrTsxyee2eJb45CgnLSLC4BFb1UAoP8VuRRSf_mUjgBA&oe=65CA881A" alt="" />
          <div>
            <pre>Lorem ipsum dolor sit amet consectetur adipisicing elit.</pre>
            <p><span>by jack</span>10m ago</p>
          </div>
        </div>
      </div>

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
    </div>
  )
}
