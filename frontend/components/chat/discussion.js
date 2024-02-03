import Link from 'next/link';
import styles from '../../styles/discussion.module.css'

export default function DiscussionPage() {
    return (
        <div className={styles.middleBloc}>
            <div className={styles.receiver}>
                <Link href="./chat"><i className="fa-solid fa-arrow-left"></i></Link>
                <Link href="./profile">
                    <img src="feed3.png" alt="" />
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
            image: 'feed3.png',
            text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
            time: "1days ago"
        },
        {
            image: '',
            text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
            time: "1days ago"
        },
        {
            image: '',
            text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
            time: "1days ago"
        },
        {
            image: 'feed3.png',
            text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
            time: "1days ago"
        },
        {
            image: '',
            text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
            time: "1days ago"
        },
        {
            image: 'feed3.png',
            text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
            time: "1days ago"
        },
        {
            image: 'feed3.png',
            text: "Lorem ipsum dolor sit amet elit consectetur adipisicing.",
            time: "1days ago"
        },

    ]
    return (
        <div className={styles.containerChatMessage}>
            {
                data.map((item, index) =>
                    item.image != "" ?
                        (<MessageReceiver key={index} image={item.image} text={item.text} time={item.time} />)
                        :
                        (<MessageSender key={index} text={item.text} time={item.time} />)
                )
            }
        </div>
    )

}

export function MessageReceiver({ image, text, time }) {
    return (
        <div className={styles.contentMesReceiver} >
            <div>
                <Link href="./profile">
                    <img src={"" + image} alt="" />
                </Link>
                <pre className={styles.messageReceiver}>{text}</pre >
            </div>
            <p>{time}<i className="fa-solid fa-check-double"></i></p>
        </div>
    );
}
export function MessageSender({ text, time }) {
    return (
        <div className={styles.contentMesSender} >
            <pre className={styles.messageSender}>{text}</pre >
            <p>{time}<i className="fa-solid fa-check-double"></i></p>
        </div>
    )
}