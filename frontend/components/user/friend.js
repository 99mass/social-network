import Link from "next/link";
import styles from "../../styles/modules/profile.module.css";
import { useEffect, useState } from "react";
import {
  UnfollowUser,
  deleteAskingFriends,
  getFollowers,
  getFollowingUsers,
} from "../../handler/follower";

export default function Friends({ idUser }) {
  const [toggleList, setToggleList] = useState(true);

  const handleToggleList = () => {
    if (!toggleList) setToggleList(true);
    else setToggleList(false);
  };

  return (
    <div className={styles.body2}>
      <div className={styles.friendFololowingMe}>
        <div className={styles.menus}>
          <span
            onClick={handleToggleList}
            className={toggleList ? styles.active : styles.default}
          >
            <i className="fa-solid fa-person-arrow-down-to-line"></i>Follower
          </span>
          <span
            onClick={handleToggleList}
            className={!toggleList ? styles.active : styles.default}
          >
            <i className="fa-solid fa-person-arrow-up-from-line"></i>Following
          </span>
        </div>
        {toggleList && <FollowerFriends />}
        {!toggleList && <FollowingFriends />}
      </div>
    </div>
  );
}

export function FollowerFriends() {
  const [FollowersList, setFollowerList] = useState(null);
  useEffect(() => {
    getFollowers(setFollowerList);
  }, []);

  const handlerFollower = (iduser) => {
    // UnfollowUser(iduser, null, setFollowerList, null);
    deleteAskingFriends(iduser, null, null, setFollowerList);
  };

  return (
    <div className={styles.contentListFriend}>
      {FollowersList &&
        FollowersList.map((user, index) => (
          <div key={`${user.follower_id}${index}`} className={styles.bloc}>
            <img
              src={
                user.avatarpath
                  ? `data:image/png;base64,${user.avatarpath}`
                  : "../images/user-circle.png"
              }
              alt=""
            />

            <div className={styles.conteUnfollow}>
              <h4>{`${user.firstname} ${user.lastname}`}</h4>
              <span
                onClick={() => handlerFollower(user.follower_id)}
                className={styles.unfollowBtn}
              >
                <i className="fa-solid fa-rectangle-xmark"></i>unfollow
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
export function FollowingFriends() {
  const [FolloweingUsersList, setFollowingUsersList] = useState(null);
  useEffect(() => {
    getFollowingUsers(setFollowingUsersList);
  }, []);

  const handlerFollower = (iduser) => {
    // deleteAskingFriends(iduser, null, null, null, setFollowingUsersList);
    // UnfollowUser(iduser,null,setFollowingUsersList);
  };
  return (
    <div className={styles.contentListFriend}>
      {FolloweingUsersList &&
        FolloweingUsersList.map((user, index) => (
          <div key={`${user.follower_id}${index}`} className={styles.bloc}>
            <img
              src={
                user.avatarpath
                  ? `data:image/png;base64,${user.avatarpath}`
                  : "../images/user-circle.png"
              }
              alt=""
            />

            <div className={styles.conteUnfollow}>
              <h4>{`${user.firstname} ${user.lastname}`}</h4>
              <span
                onClick={() => handlerFollower(user.follower_id)}
                className={styles.unfollowBtn}
              >
                <i className="fa-solid fa-rectangle-xmark"></i>unfollow
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
