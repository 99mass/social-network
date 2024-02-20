import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/modules/profile.module.css";
import Posts_user from "./posts";
import Edit_Profile from "./edit_profile";
import Friends from "./friend";
import { getDatasProfilUser } from "../../handler/user_profile";
import { getPostsUserCreated } from "../../handler/getPostsUser";
import { ErrorProfile } from "../errors/error_profiles";
import { UnfollowUser, askForFriends } from "../../handler/follower";
import { errorNotification } from "../../utils/sweeAlert";

export default function Profile_user() {
  const [datas, setDatas] = useState(null);
  const [postsCreated, setPostsCreated] = useState(null);
  const [error, setError] = useState(false);

  const [editButton, setEditButton] = useState({
    button1: true,
    button2: false,
    button3: false,
    button4: false,
  });
  const router = useRouter();
  const { userid } = router.query;

  // recuperer les information du user
  useEffect(() => {
    if (!datas) {
      getDatasProfilUser(setDatas, userid);
    }
    getPostsUserCreated(userid, setPostsCreated);
  }, [userid, datas]);
  

  const condition=(datas?.isowner || !datas?.isowner && (datas?.user.ispublic || (!datas?.user.ispublic && datas?.isfriend)));
  
  const handleButtonClick = (buttonNumber) => {
    setEditButton({
      button1: buttonNumber === 1,
      button2: buttonNumber === 2,
      button3: buttonNumber === 3,
      button4: buttonNumber === 4,
    });
    if ((buttonNumber===1 || buttonNumber==3) && !condition) {
      errorNotification("you can't see some information because you're not friends");
    }
  };

  return (
    <>
      {datas ? (
        <ContentCovertPhoto
          iduser={datas.user.id}
          userPicture={datas.user.avatarpath}
          firstname={datas.user.firstname}
          lastname={datas.user.lastname}
          ispublic={datas.user.ispublic}
          isowner={datas.isowner}
          isfriend={datas.isfriend}
          editButton={editButton}
          handleButtonClick={handleButtonClick}
          setDatas={setDatas}
        />
      ) : (
        <ErrorProfile />
      )}

      {editButton.button1 && condition && (
        <Posts_user
          postsCreated={postsCreated && postsCreated}
          setPostsCreated={setPostsCreated}
          about={datas && datas.user.aboutme}
        />
      )}
      {editButton.button2 && (
        <Edit_Profile
          handleButtonClick={handleButtonClick}
          datas={datas}
          userid={userid}
          setDatas={setDatas}
        />
      )}
      {editButton.button3 && condition  && <Friends idUser={userid} />}
    </>
  );
}
export function ContentCovertPhoto({
  iduser,
  userPicture,
  firstname,
  lastname,
  ispublic,
  isowner,
  isfriend,
  editButton,
  handleButtonClick,
  setDatas,
}) {
  const handlerFollower = () => {    
    if (!isfriend ) {
      askForFriends(iduser, null, setDatas);
    }
  };

  return (
    <div className={styles.photoCovert}>
      <div className={styles.firstImg}>
        <img src={userPicture ? `data:image/png;base64,${userPicture}` : ""} />
      </div>

      <div className={styles.userDetails}>
        <div className={styles.userDetailsPart01}>
          <div>
            {userPicture && (
              <img src={`data:image/png;base64,${userPicture}`} alt="" />
            )}
            {!userPicture && <img src={"../images/default-image.svg"} alt="" />}
            <p>
              <span>{firstname && `${firstname} ${lastname}`}</span>
              <span className={styles.profileTypes}>
                <span>
                  <i className="fas fa-globe-africa"></i>
                  {ispublic ? `Public` : `Private`} profile ·
                </span>
                <span> 25k friends</span>
              </span>
            </p>
          </div>
          {!isowner && (
            <div className={styles.blocFlow}>
              <span
                onClick={handlerFollower}
                className={styles.active}
              >
                <i className={`fa-solid ${!isfriend ? 'fa-square-plus' : "fa-square-xmark"}`}></i>Follow
              </span>
            </div>
          )}
        </div>
        <NavMenu
          isOwner={isowner}
          ispublic={ispublic}
          editButton={editButton}
          handleButtonClick={handleButtonClick}
        />
      </div>
    </div>
  );
}

export function NavMenu({ isOwner, ispublic, editButton, handleButtonClick }) {
  return (
    <div className={styles.menu}>
      <span
        onClick={() => handleButtonClick(1)}
        className={editButton.button1 ? styles.active : styles.default}
      >
        <i className="fa-solid fa-signs-post"></i>Post
      </span>
      {isOwner && (
        <span
          onClick={() => handleButtonClick(2)}
          className={editButton.button2 ? styles.active : styles.default}
          title="Click to follow user"
        >
          <i className="fa-solid fa-pen"></i>Edit profile
        </span>
      )}
      <span
        onClick={() => handleButtonClick(3)}
        className={editButton.button3 ? styles.active : styles.default}
        title="Click to follow user"
      >
        <i className="fa-solid fa-user-group"></i>Friends
      </span>
    </div>
  );
}
