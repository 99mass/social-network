import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/Friend.module.css";
import {
  confirmFriends,
  deleteAskingFriends,
  getAskForFriendLists,
} from "../../handler/follower";
import { getElapsedTime } from "../../utils/convert_dates";

export default function MiddleBlocFriend() {
  const [datas, setDatas] = useState(null);

  useEffect(() => {
    getAskForFriendLists(setDatas);
  }, [datas]);

  const handlerConfirmFollow = (iduser) => {
    confirmFriends(iduser, setDatas);
  };
  const handlerDeleteFollow = (iduser) => {
    deleteAskingFriends(iduser, setDatas);
  };

  return (
    <div className={styles.middleBloc}>
      <h1>Friends</h1>
      <h4>Friend requests</h4>
      {datas &&
        datas.map((item, index) => (
          <div className={styles.contentFriend} key={index}>
            <Link href={`./profileuser?userid=${item.id}`}>
              {item.avatarpath && (
                <img src={`data:image/png;base64,${item.avatarpath}`} alt="" />
              )}
              {!item.avatarpath && (
                <img src={"../images/default-image.svg"} alt="" />
              )}
            </Link>
            <div className={styles.detailsFriendRequest}>
              <div className={styles.friendName}>
                <span>{`${item.firstname} ${item.lastname}`}</span>
                <span>
                  {`${getElapsedTime(item.created_at).value} ${
                    getElapsedTime(item.created_at).unit
                  }`}
                </span>
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
    </div>
  );
}
