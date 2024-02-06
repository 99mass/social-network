import Link from 'next/link';
import styles from '../../styles/modules/Notification.module.css'
export default function Notification() {
    const data = [
        {
            type: "group",
            groupName: "rmc",
            numberPost: 12,
            time: "8hours",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYFgEPSzpfahM5mJKaFGFZggzX9PfE7-ejUQ&usqp=CAU"
        },
        {
            type: "group",
            groupName: "rts1",
            numberPost: 5,
            time: "18hours",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShR0xdAlQE0K4-PPUkCW2FDEV6OZZRXzGzIQ&usqp=CAU"
        },
        {
            type: "personal",
            personName: "John",
            groupName: "devGroup",
            time: "1days",
            image: "https://www.keplearning.com/wp-content/uploads/2021/03/web-dev.jpg"
        },
        {
            type: "group",
            groupName: "france24",
            numberPost: 22,
            time: "2days",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSve9Yf3ME-APROjIBHsbZFus60BIrkvvMRkQ&usqp=CAU"
        },
        {
            type: "group",
            groupName: "canal+",
            numberPost: 142,
            time: "4days",
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWkDCFGDl8ABM9GO_De-eh-Vm7cJjRYTL6lQ&usqp=CAU'
        },
        {
            type: "personal",
            personName: "breukh",
            groupName: "sonatel academy",
            time: "4days",
            image: "https://sonatelacademy.com/wp-content/uploads/2023/10/sonatel_academy.png"
        },

        {
            type: "personal",
            personName: "modou",
            groupName: "zone01 dakar",
            time: "2weeks",
            image: "https://ml-eu.globenewswire.com/Resource/Download/8855597f-74cc-40b7-b6ac-ca9b4987f3fa"
        }
     
    ]

    return (
        <div className={styles.middleBloc}>
            <h1>Notifications</h1>
            {
                data.map((item, index) => (
                    item.type !== "group" ?
                        (<BuildInvitationGroupNotif key={index} image={item.image}  personName={item.personName} groupName={item.groupName}  time={item.time} />)
                        :
                        (<BuildPublishesNotif key={index} image={item.image} groupName={item.groupName} numberPost={item.numberPost} time={item.time} />)
                ))
            }

        </div>
    )

}

export function BuildPublishesNotif({ image, groupName, numberPost, time }) {
    return (
        <div className={styles.contentNotif}>
            <img src={image} alt="" />
            <div className={styles.detailsNotif}>
                <Link href="./profilegroup">
                    <p className={styles.notifText}>{groupName} publishes {numberPost} new posts</p>
                    <div className={styles.dateNotif}>{time}</div>
                </Link>
            </div>
        </div>
    )
}
export function BuildInvitationGroupNotif({ image, personName, groupName, time }) {
    return (
        <div className={styles.contentNotif}>
            <img src={image} alt="" />
            <div className={styles.detailsNotif}>
                <Link href="./profilegroup">
                    <p className={styles.notifText}>
                        {personName} invites you to join {groupName} group
                    </p>
                    <div className={styles.dateNotif}>{time}</div>
                </Link>
            </div>
        </div>
    )
}
