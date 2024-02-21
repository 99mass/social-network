import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/Friend.module.css";

import {
  confirmFriends,
  deleteAskingFriends,
  getAskForFriendLists,
  getFriendsLists,
} from "../../handler/follower";
import { getElapsedTime } from "../../utils/convert_dates";
import { getUserBySession } from "../../handler/getUserBySession";

export default function MiddleBlocFriend() {
  const [datasUser, setDatasUser] = useState(null);
  const [datas, setDatas] = useState(null);
  const [friends, setFriends] = useState(false);
  const [FriendsList, setFriendsList] = useState(null);

  useEffect(() => {
    if (!datasUser) {
      getUserBySession(setDatasUser);
    } else {
      getAskForFriendLists(setDatas);
      getFriendsLists(datasUser.id, setFriendsList);
    }
  }, [datasUser]);

  const handlerConfirmFollow = (iduser) => {
    confirmFriends(iduser, setDatas);
  };
  const handlerDeleteFollow = (iduser) => {
    deleteAskingFriends(iduser, setDatas);
  };
  const toggleFriend = (prevState) => setFriends(prevState);

  return (
    <div className={styles.middleBloc}>
      <h1>Friends</h1>
      <div className={styles.navbar}>
        <h4
          onClick={() => toggleFriend(false)}
          className={friends ? styles.defaultColor : styles.activeColor}
          title="Click to view friend request"
        >
          <i className="fa-solid fa-user-plus"></i>Friend requests
        </h4>
        <h4
          onClick={() => toggleFriend(true)}
          className={!friends ? styles.defaultColor : styles.activeColor}
          title="Click to view all friends"
        >
          <i className="fa-solid fa-users-line"></i>All friends
        </h4>
      </div>
      <hr />
      {datas &&
        !friends &&
        datas.map((item, index) => (
          <div className={styles.contentFriend} key={index}>
            <Link href={`./profileuser?userid=${item.follower_id}`}>
              {item.avatarpath ? (
                <img
                  src={`data:image/png;base64,${item.avatarpath}`}
                  alt="User avatar"
                />
              ) : (
                <img
                  src={"../images/default-image.svg"}
                  alt="Default user avatar"
                />
              )}
            </Link>
            <div className={styles.detailsFriendRequest}>
              <div className={styles.friendName}>
                <span>{`${item.firstname} ${item.lastname}`}</span>
                <span>{`${getElapsedTime(item.created_at).value} ${
                  getElapsedTime(item.created_at).unit
                }`}</span>
              </div>
              <div className={styles.validateRequest}>
                <button onClick={() => handlerConfirmFollow(item.follower_id)}>
                  confirm
                </button>
                <button onClick={() => handlerDeleteFollow(item.follower_id)}>
                  delete
                </button>
              </div>
            </div>
          </div>
        ))}
      {!friends && !datas && (
        <div className="noResults">
          <img src="../images/no-result.png" alt="no result found" />
          <p>there are no requests friend</p>
        </div>
      )}
      {friends && FriendsList && <ALLFriends FriendsList={FriendsList} />}
      {friends && !FriendsList && (
        <div className="noResults">
          <img src="../images/no-result.png" alt="no result found" />
          <p>you have no friends </p>
        </div>
      )}
    </div>
  );
}

export function ALLFriends({ FriendsList }) {
  return (
    <div className={styles.containerAllFriend}>
      {FriendsList.map((item) => (
        <Link
          href={`./profileuser?userid=${item.id}`}
          key={item.id}
          className={styles.userBloc}
        >
          {item.avatarpath ? (
            <img
              src={`data:image/png;base64,${item && item.avatarpath}`}
              alt=""
            />
          ) : (
            <img src={`../images/user-circle.png`} alt="" />
          )}
          <p>{`${item.firstname} ${item.lastname}`}</p>
        </Link>
      ))}
    </div>
  );
}
