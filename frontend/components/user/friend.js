import Link from 'next/link';
import styles from '../../styles/profile.module.css';


export default function Friends() {
    return(
        <div className={styles.friendFololowingMe}>
        <div className={styles.menus}>
            <span><i className="fa-solid fa-user-group"></i>Follower</span>
            <span><i className="fa-solid fa-user-group"></i>Following</span>
            <FollowerFriends/>
        </div>
       
    </div>
    )
}

export function FollowerFriends() {
    return(
         <div className={styles.contentListFriend}>
            <div className={styles.bloc}>
               <Link href=""> <img src="https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=" alt="" /></Link>
                <div className={styles.conteUnfollow}>
                    <h4>Mickiey</h4>
                    <span className={styles.unfollowBtn}><i className="fa-solid fa-rectangle-xmark"></i>unfollow</span>                
                </div>
               
            </div>
        </div>
    )
}