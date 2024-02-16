import Link from "next/link";
import styles from "../../styles/modules/Friend.module.css";
import { useState } from "react";
import { confirmFriends, deleteAskingFriends, getFriendsLists, getOldestrequestfollow } from "../../handler/follower";
import { getElapsedTime } from "../../utils/convert_dates";

export default function RightBloc({ datasUser }) {
  const [FriendsList, setFriendsList] = useState(null);
  const [oldestrequestfollowDatas, setOldestrequestfollowDatas] = useState(null);

  let userId = datasUser && datasUser.id;

  if (FriendsList === null && userId !== null) {
    getFriendsLists(userId, setFriendsList);
  }
  if (oldestrequestfollowDatas === null) {
    getOldestrequestfollow(setOldestrequestfollowDatas);
  }


  return (
    <div className="menu-rigth">
      {oldestrequestfollowDatas && <LastFrienRequest data={oldestrequestfollowDatas} setOldestrequestfollowDatas={setOldestrequestfollowDatas} />}
      <hr className="menu-rigth-hr" />
      <FriendOnLine FriendsList={FriendsList} />
    </div>
  );
}

export function LastFrienRequest({ data, setOldestrequestfollowDatas }) {

  const handlerConfirmFollow = (iduser) => {
    confirmFriends(iduser, null, setOldestrequestfollowDatas);
  };
  const handlerDeleteFollow = (iduser) => {
    deleteAskingFriends(iduser, null, setOldestrequestfollowDatas);
  };


  return (
    <>
      {data && <div className="title">
        <h4>Friend requests</h4>
        <span>
          <Link href="./friend" title="see all friend request">
            see all
          </Link>
        </span>
      </div>}

      {data && <div className={styles.contentFriend}>
        <Link href={`./profileuser?userid=${data.follower_id}`}>
          {data.avatarpath && <img
            src={`data:image/png;base64,${data.avatarpath}`}
            alt=""
          />}
          {!data.avatarpath && <img
            src={`../images/user-circle.png`}
            alt=""
          />}
        </Link>
        <div className={styles.detailsFriendRequest}>
          <div className={styles.friendName}>
            <span>{`${data.firstname} ${data.lastname}`}</span>
            <span>{`${getElapsedTime(data.created_at).value} ${getElapsedTime(data.created_at).unit}`}</span>
          </div>
          <div className={styles.validateRequest}>
            <button onClick={() => handlerConfirmFollow(data.follower_id)} >confirm</button>
            <button onClick={() => handlerDeleteFollow(data.follower_id)} >delete</button>
          </div>
        </div>
      </div>}
    </>
  );
}

export function FriendOnLine({ FriendsList }) {
  return (
    <div className="friend-online">
      <h4>Chat with Friend online</h4>
      <div className="list-users">
        {FriendsList &&
          FriendsList.map((item) => (
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
