import Link from "next/link";
import styles from "../../styles/modules/Friend.module.css";
import { useState } from "react";
import { getFriendsLists } from "../../handler/follower";

export default function RightBloc({ datasUser }) {
  const [FriendsList, setFriendsList] = useState(null);

  let userId = datasUser && datasUser.id;

  if (FriendsList === null && userId !== null) {
    getFriendsLists(userId, setFriendsList);
  }

  return (
    <div className="menu-rigth">
      <LastFrienRequest />
      <hr className="menu-rigth-hr" />
      <FriendOnLine FriendsList={FriendsList} />
    </div>
  );
}

export function LastFrienRequest() {
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
        <Link href={`./profileuser?userid=`}>
          <img
            src="https://media.istockphoto.com/id/1284284200/fr/photo/il-est-en-mission.webp?b=1&s=170667a&w=0&k=20&c=mZu_lKLMus2gBTFkRH2KQjsSsD70ycU-rRp9eP1MjsM="
            alt=""
          />
        </Link>
        <div className={styles.detailsFriendRequest}>
          <div className={styles.friendName}>
            <span>ssambadi</span>
            <span>19s</span>
          </div>
          <div className={styles.validateRequest}>
            <button>confirm</button>
            <button>delete</button>
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
