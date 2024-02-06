import Link from "next/link";
import styles from "../../styles/modules/profile.module.css";
import { useState } from "react";

export default function Friends() {
  const data = [
    {
      type: "follower",
      name: "alice doe",
      image:
        "https://plus.unsplash.com/premium_photo-1706430116397-3aaba92f5a0a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8",
    },
    {
      type: "follower",
      name: "michel doe",
      image:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      type: "follower",
      name: "jack doe",
      image:
        "https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
    },
    {
      type: "follower",
      name: "christin doe",
      image:
        "https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o=",
    },
    {
      type: "following",
      name: "alice doe 2",
      image:
        "https://plus.unsplash.com/premium_photo-1706430116397-3aaba92f5a0a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8",
    },
    {
      type: "following",
      name: "michel doe 2",
      image:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      type: "following",
      name: "jack doe 2",
      image:
        "https://media.istockphoto.com/id/1353378620/fr/photo/femme-africaine-joyeuse-portant-un-foulard-rouge-%C3%A0-la-mode.webp?b=1&s=170667a&w=0&k=20&c=Cz5FmsMm-n7yWq4MOzZY0ixdm9CLzNGg_MDPP3rptIA=",
    },
    {
      type: "following",
      name: "christin doe 2",
      image:
        "https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o=",
    },
  ];

  const [friend, setFriend] = useState(true);
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
           <i class="fa-solid fa-person-arrow-down-to-line"></i>Follower
          </span>
          <span
            onClick={handleSetFriend}
            className={!friend ? styles.active : styles.default}
          >
            <i class="fa-solid fa-person-arrow-up-from-line"></i>Following
          </span>
        </div>
        {friend && <FollowerFriends data={data} />}
        {!friend && <FollowingFriends data={data} />}
      </div>
    </div>
  );
}

export function FollowerFriends({ data }) {
  return (
    <div className={styles.contentListFriend}>
      {data.map((item, index) =>
        item.type === "follower" ? (
          <div key={index} className={styles.bloc}>
            <Link href="./profileuser">
              <img src={item.image} alt="" />
            </Link>
            <div className={styles.conteUnfollow}>
              <h4>{item.name}</h4>
              <span className={styles.unfollowBtn}>
                <i className="fa-solid fa-rectangle-xmark"></i>unfollow
              </span>
            </div>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
}

export function FollowingFriends({ data }) {
  return (
    <div className={styles.contentListFriend}>
      {data.map((item, index) =>
        item.type === "following" ? (
          <div key={index} className={styles.bloc}>
            <Link href="./profileuser">
              <img src={item.image} alt="" />
            </Link>
            <div className={styles.conteUnfollow}>
              <h4>{item.name}</h4>
              <span className={styles.unfollowBtn}>
                <i className="fa-solid fa-rectangle-xmark"></i>unfollow
              </span>
            </div>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
}
