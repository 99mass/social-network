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
    if (datas === null) {
      getDatasProfilUser(setDatas, userid);
    }
    getPostsUserCreated(userid, setPostsCreated, setError);
  }, [userid, datas]);

console.log(datas && datas);
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
          userPicture={datas && datas.avatarpath}
          firstname={datas && datas.firstname}
          lastname={datas && datas.lastname}
          ispublic={datas && datas.ispublic}
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

          about={datas && datas.aboutme}
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
      {!viewfriend && <Friends />}
    </>
  );
}
export function ContentCovertPhoto({
  userPicture,
  firstname,
  lastname,
  ispublic,
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
                <i className="fas fa-globe-africa"></i>{ispublic ? `Public` : `Private`} profile ·
              </span>
              <span> 25k friends</span>
            </span>
          </p>
        </div>
        <NavMenu
          handleEditForm={handleEditForm}
          setViewfriend={setViewfriend}
          edit={edit}
          viewfriend={viewfriend}
        />
      </div>
    </div>
  );
}

export function NavMenu({ handleEditForm, setViewfriend, edit, viewfriend }) {
  return (
    <div className={styles.menu}>
      <span
        onClick={() => setViewfriend(true)}
        className={viewfriend && !edit ? styles.active : styles.default}
      >
        <i className="fa-solid fa-signs-post"></i>Post
      </span>
      <span
        onClick={handleEditForm}
        className={edit ? styles.active : styles.default}
      >
        <i className="fa-solid fa-pen"></i>Edit profile
      </span>
      <span
        onClick={() => setViewfriend(false)}
        className={!viewfriend ? styles.active : styles.default}
      >
        <i className="fa-solid fa-user-group"></i>Friends
      </span>
    </div>
  );
}
