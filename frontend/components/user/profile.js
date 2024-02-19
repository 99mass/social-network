import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/modules/profile.module.css";
import Posts_user from "./posts";
import Edit_Profile from "./edit_profile";
import Friends from "./friend";
import { getDatasProfilUser } from "../../handler/user_profile";
import { getPostsUserCreated } from "../../handler/getPostsUser";
import { ErrorProfile } from "../errors/error_profiles";

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
  const handleButtonClick = (buttonNumber) => {
    setEditButton({
      button1: buttonNumber === 1,
      button2: buttonNumber === 2,
      button3: buttonNumber === 3,
      button4: buttonNumber === 4,
    });
  };
  const router = useRouter();
  const { userid } = router.query;

  // recuperer les information du user
  useEffect(() => {
    if (!datas) {
      getDatasProfilUser(setDatas, userid);
    }
    getPostsUserCreated(userid, setPostsCreated);
  }, [userid, datas]);

  return (
    <>
      {datas ? (
        <ContentCovertPhoto
          userPicture={datas && datas.user.avatarpath}
          firstname={datas && datas.user.firstname}
          lastname={datas && datas.user.lastname}
          ispublic={datas && datas.user.ispublic}
          isowner={datas && datas.isowner}
          editButton={editButton}
          handleButtonClick={handleButtonClick}
          setDatas={setDatas}
          
        />
      ) : (
        <ErrorProfile />
      )}

      {editButton.button1 && (
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
      {editButton.button3 && <Friends idUser={userid} />}
    </>
  );
}
export function ContentCovertPhoto({
  userPicture,
  firstname,
  lastname,
  ispublic,
  isowner,
  editButton,
  handleButtonClick,
  setDatas
}) {

    const handlerFollower=()=>{
      
    }

  return (
    <div className={styles.photoCovert}>
      <div className={styles.firstImg}>
        <img src={userPicture ? `data:image/png;base64,${userPicture}` : ""} />
      </div>

      <div className={styles.userDetails}>
        <div  className={styles.userDetailsPart01}>
          <div >
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
          <div className={styles.blocFlow}>
            <span className={true ? styles.active : styles.default} >
              <i className="fa-solid fa-square-plus"></i>Follow
            </span>
            <span className={false ? styles.active : styles.default} >
              <i className="fa-solid fa-square-xmark"></i>UnFollow
            </span>
          </div>
        </div>
        <NavMenu
          isowner
          isOwner={isowner}
          editButton={editButton}
          handleButtonClick={handleButtonClick}
        />
      </div>
    </div>
  );
}

export function NavMenu({ isOwner, editButton, handleButtonClick }) {
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
