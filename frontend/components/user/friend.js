import Link from "next/link";
import styles from "../../styles/modules/profile.module.css";
import { useEffect, useState } from "react";
import { UnfollowUser, getFollowers, getFollowingUsers } from "../../handler/follower";

export default function Friends({idUser}) {

  const [FollowersList, setFollowerList] = useState(null);
  const [FolloweingUsersList, setFollowingUsersList] = useState(null);

  const [friend, setFriend] = useState(true);

  useEffect(() => {
    getFollowers(idUser, setFollowerList);
  }, []);
  useEffect(() => {
    getFollowingUsers(idUser, setFollowingUsersList);
  }, []);
  
  
  console.log(FollowersList && FollowersList);

  const handleSetFriend = () => {
    if (!friend) {
      setFriend(true);
    } else {
      setFriend(false);
    }
  };

  return (
    <div className={styles.body2}>
      <div className={styles.friendFololowingMe}>
        <div className={styles.menus}>
          <span
            onClick={handleSetFriend}
            className={friend ? styles.active : styles.default}
          >
            <i className="fa-solid fa-person-arrow-down-to-line"></i>Follower
          </span>
          <span
            onClick={handleSetFriend}
            className={!friend ? styles.active : styles.default}
          >
            <i className="fa-solid fa-person-arrow-up-from-line"></i>Following
          </span>
        </div>
        {friend && <FollowerFriends FollowersList={FollowersList} setFollowerList={setFollowerList} userConId={idUser} />}
        {!friend && <FollowingFriends FolloweingUsersList={FolloweingUsersList} setFollowingUsersList={setFollowingUsersList} />}
      </div>
    </div>
  );
}

export function FollowerFriends({ FollowersList,setFollowerList,userConId }) {
  const handlerFollower = (iduser) => {
      UnfollowUser(iduser, null,setFollowerList,userConId);
    }
  return (
    <div className={styles.contentListFriend}>
      {FollowersList && FollowersList.map((user) =>
          <div key={user.follower_id} className={styles.bloc}>
              <img src={user.avatarpath ? `data:image/png;base64,${user.avatarpath}` : "../images/user-circle.png"} alt="" />
         
            <div className={styles.conteUnfollow}>
              <h4>{`${user.firstname} ${user.lastname}`}</h4>
              <span onClick={()=>handlerFollower(user.follower_id)} className={styles.unfollowBtn}>
                <i className="fa-solid fa-rectangle-xmark"></i>unfollow
              </span>
            </div>
          </div>
      )}
    </div>
  );
}
export function FollowingFriends({ FolloweingUsersList,setFollowingUsersList,userConId }) {
  const handlerFollower = (iduser) => {
      UnfollowUser(iduser, null,setFollowingUsersList,userConId);
    }
  return (
    <div className={styles.contentListFriend}>
      {FolloweingUsersList && FolloweingUsersList.map((user) =>
          <div key={user.follower_id} className={styles.bloc}>
              <img src={user.avatarpath ? `data:image/png;base64,${user.avatarpath}` : "../images/user-circle.png"} alt="" />
         
            <div className={styles.conteUnfollow}>
              <h4>{`${user.firstname} ${user.lastname}`}</h4>
              <span onClick={()=>handlerFollower(user.follower_id)} className={styles.unfollowBtn}>
                <i className="fa-solid fa-rectangle-xmark"></i>unfollow
              </span>
            </div>
          </div>
      )}
    </div>
  );
}

// export function FollowingFriends({ FolloweingUsersList }) {
//   return (
//     <div className={styles.contentListFriend}>
//       {FolloweingUsersList.map((item, index) =>
//         item.type === "following" ? (
//           <div key={index} className={styles.bloc}>
//             <Link href={`./profileuser?userid=`}>
//               <img src={item.image} alt="" />
//             </Link>
//             <div className={styles.conteUnfollow}>
//               <h4>{item.name}</h4>
//               <span className={styles.unfollowBtn}>
//                 <i className="fa-solid fa-rectangle-xmark"></i>unfollow
//               </span>
//             </div>
//           </div>
//         ) : (
//           "No user Found"
//         )
//       )}
//     </div>
//   );
// }
