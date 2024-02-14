import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/Friend.module.css";
import { confirmFriends, deleteAskingFriends, getAskForFriendLists } from "../../handler/follower";
import { getElapsedTime } from "../../utils/convert_dates";

export default function MiddleBlocFriend() {
  const [datas, setDatas] = useState(null);

  useEffect(() => {
    getAskForFriendLists(setDatas);
  }, [datas]);

  const handlerConfirmFollow=(iduser)=>{
      console.log("iduser"+iduser);
      confirmFriends(iduser,setDatas)
  }
  const handlerDeleteFollow=(iduser)=>{
    console.log("iduser"+iduser);
    deleteAskingFriends(iduser,setDatas)
}

  return (
    <div className={styles.middleBloc}>
      <h1>Friends</h1>
      <h4>Friend requests</h4>
      {datas &&
        datas.map((item) => (
          <div className={styles.contentFriend} key={item.id}>
            <Link href={`./profileuser?userid=${item.id}`}>
              <img src={`data:image/png;base64,${item.avatarpath}`} alt="" />
            </Link>
            <div className={styles.detailsFriendRequest}>
              <div className={styles.friendName}>
                <span>{`${item.firstname} ${item.lastname}`}</span>
                <span>
                  {`${getElapsedTime(item.createdat).value} ${
                    getElapsedTime(item.createdat).unit
                  }`}
                </span>
              </div>
              <div className={styles.validateRequest}>
                <button onClick={()=>handlerConfirmFollow(item.id)}>confirm</button>
                <button onClick={()=>handlerDeleteFollow(item.id)}>delete</button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
