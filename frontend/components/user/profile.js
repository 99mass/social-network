import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/modules/profile.module.css";
import Posts_user from "./posts";
import Edit_Profile from "./edit_profile";
import { useEffect, useState } from "react";
import Friends from "./friend";
import { getDatasProfilUser } from "../../handler/user_profile";
import { getPostsUserCreated } from "../../handler/getPostsUser";
import { ErrorProfile } from "../errors/error_profiles";

export default function Profile_user() {
  const [datas, setDatas] = useState(null);
  const [postsCreated, setPostsCreated] = useState(null);
  const [error, setError] = useState(false);

  const [edit, setEdit] = useState(false);
  const [viewfriend, setViewfriend] = useState(true);
  const router = useRouter();
  const { userid } = router.query;

  // recuperer les information du user
  useEffect(() => {
    if (!datas) {
      getDatasProfilUser(setDatas, userid);
    }
    getPostsUserCreated(userid, setPostsCreated);
  }, [userid, datas]);

  const handleEditForm = () => {
    if (!edit) setEdit(true);
  };
  const CloseEditForm = () => {
    if (edit) setEdit(false);
  };
  const handleSetViewfriend = (state) => {
    setViewfriend(state);
  };

  return (
    <>
      {datas ? (
        <ContentCovertPhoto
          userPicture={datas && datas.user.avatarpath}
          firstname={datas && datas.user.firstname}
          lastname={datas && datas.user.lastname}
          ispublic={datas && datas.user.ispublic}
          isowner={datas && datas.isowner}
          handleEditForm={handleEditForm}
          setViewfriend={handleSetViewfriend}
          edit={edit}
          viewfriend={viewfriend}
        />
      ) : (
        <ErrorProfile />
      )}

      {viewfriend && (
        <Posts_user
          postsCreated={postsCreated && postsCreated}
          setPostsCreated={setPostsCreated}
          about={datas && datas.user.aboutme}
        />
      )}
      {edit && (
        <Edit_Profile
          CloseEditForm={CloseEditForm}
          datas={datas}
          userid={userid}
          setDatas={setDatas}
        />
      )}
      {!viewfriend && <Friends idUser={userid} />}
    </>
  );
}
export function ContentCovertPhoto({
  userPicture,
  firstname,
  lastname,
  ispublic,
  isowner,
  handleEditForm,
  setViewfriend,
  edit,
  viewfriend,
}) {
  return (
    <div className={styles.photoCovert}>
      <div className={styles.firstImg}>
        <img src={userPicture ? `data:image/png;base64,${userPicture}` : ""} />
      </div>

      <div>
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
        <NavMenu
          handleEditForm={handleEditForm}
          setViewfriend={setViewfriend}
          edit={edit}
          isowner
          isOwner={isowner}
          viewfriend={viewfriend}
        />
      </div>
    </div>
  );
}

export function NavMenu({
  handleEditForm,
  setViewfriend,
  edit,
  isOwner,
  viewfriend,
}) {
  return (
    <div className={styles.menu}>
      <span
        onClick={() => setViewfriend(true)}
        className={viewfriend && !edit ? styles.active : styles.default}
      >
        <i className="fa-solid fa-signs-post"></i>Post
      </span>
      {isOwner && (
        <span
          onClick={handleEditForm}
          className={edit ? styles.active : styles.default}
        >
          <i className="fa-solid fa-pen"></i>Edit profile
        </span>
      )}
      <span
        onClick={() => setViewfriend(false)}
        className={!viewfriend ? styles.active : styles.default}
      >
        <i className="fa-solid fa-user-group"></i>Friends
      </span>
    </div>
  );
}
