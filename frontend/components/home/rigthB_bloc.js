import Link from "next/link";
import styles from "../../styles/modules/Friend.module.css";
import { useEffect, useState } from "react";
import { confirmFriends, deleteAskingFriends, getAskForFriendLists, getFriendsLists, getOldFriendList } from "../../handler/follower";
import { getElapsedTime } from "../../utils/convert_dates";

export default function RightBloc({ datasUser }) {
  const [FriendsList, setFriendsList] = useState(null);
  const [oldFriend, setoldFriend] = useState(null);
  console.log("oldFriend",oldFriend&&oldFriend);
  
  let userId = datasUser && datasUser.id;

  if (FriendsList === null && userId !== null) {
    getFriendsLists(userId, setFriendsList);
  }
  if (oldFriend === null && userId !== null) {
  getOldFriendList(userId, setoldFriend)
  }
  return (
    <div className="menu-rigth">
     {oldFriend && <LastFrienRequest oldFriend={oldFriend} userId={userId}/>}
      <hr className="menu-rigth-hr" />
      <FriendOnLine FriendsList={FriendsList} />
    </div>
  );   {data.map((item, index) => (
    <div className={styles.userBloc} key={index}>
      <div>
        <img src={item.image} alt="" />
        <span>{item.name}</span>
      </div>
      <input defaultValue={item.id} name={item.id} type="checkbox" id="" />
    </div>
  ))}
}

export function LastFrienRequest({oldFriend, datasUser}) {

  const [datas, setDatas] = useState(null);

  useEffect(() => {
    if (datas === null) {
      getAskForFriendLists(setDatas);
    }
  }, [datas]);
  const handlerConfirmFollow = (iduser) => {
    confirmFriends(iduser, setDatas);
  };
  const handlerDeleteFollow = (iduser) => {
    deleteAskingFriends(iduser, setDatas);
  };
  return (
    <>
      <div className="title">
        <h4>Friend requests</h4>
        <span>
          <Link href="./friend" title="see all friend request">
            see all
          </Link>
        </span>
      </div>
      <div className={styles.contentFriend}>
        <Link href={`./profileuser?userid=${datasUser && datasUser.id}`}>
          <img
            src={`data:image/png;base64,${oldFriend&&oldFriend.avatarpath}`}
            alt=""
          />
        </Link>
        <div className={styles.detailsFriendRequest}>
          <div className={styles.friendName}>
            <span>{oldFriend&&oldFriend.firstname+' '+ oldFriend.lastname}</span>
            <span>{oldFriend&&`${getElapsedTime( oldFriend.created_at).value} ${getElapsedTime( oldFriend.created_at).unit}`}</span>
          </div>
          <div className={styles.validateRequest}>
            <button onClick={()=> handlerConfirmFollow(oldFriend.follower_id)}>confirm</button>
            <button onClick={()=> handlerDeleteFollow(oldFriend.follower_id)}>delete</button>
          </div>
        </div>
      </div>
    </>
  );
}
export function FriendOnLine({ FriendsList }) {
  return (
    <div className="friend-online">
      <h4>Chat with Friend online</h4>
      <div className="list-users">
        {FriendsList &&
          FriendsList.map((item ) => (
            <div key={item.id}>
              <Link href="./chatpage">
                {item && item.avatarpath && (
                  <img
                    src={`data:image/png;base64,${item && item.avatarpath}`}
                    alt=""
                  />
                )}
                {!item.avatarpath && (
                  <img src={`../images/user-circle.png`} alt="" />
                )}
                <p>{item.firstname + " " + item.lastname}</p>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
