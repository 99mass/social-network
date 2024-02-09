import Link from "next/link";
import styles from "../../styles/modules/profile.module.css";
import Posts_user from "./posts";
import EditProfile from "./edit_profile";
import {  useState } from "react";
import Friends from "./friend";

export default function Profile_user() {
  
  
  const [edit, setEdit] = useState(false);
  const [viewfriend, setViewfriend] = useState(true);
  
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
      <ContentCovertPhoto
        handleEditForm={handleEditForm}
        setViewfriend={handleSetViewfriend}
        edit={edit}
        viewfriend={viewfriend}
      />
      {viewfriend && <Posts_user />}
      {edit && <EditProfile CloseEditForm={CloseEditForm}  />}
      {!viewfriend && <Friends />}
    </>
  );
}
export function ContentCovertPhoto({
  handleEditForm,
  setViewfriend,
  edit,
  viewfriend,
}) {
  return (
    <div className={styles.photoCovert}>
      <img
        src="https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY="
        alt=""
      />
      <div>
        <div>
          <img
            src="https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY="
            alt=""
          />
          <p>
            <span>breukh man</span>
            <Link href="viewfriend">259 friends</Link>
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


  
  
// export async function getServerSideProps() {
//   try {
//     const sessionId = getSessionCookie();
//     console.log(sessionId);
//     const response = await fetch(api.Profil, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': sessionId 
//       }
//     });

//     if (!response.ok) {
//       console.error('Failed to fetch profile data');
//       return {
//         props: {
//           profileData: null // En cas d'échec de la requête, retournez null pour les données du profil
//         }
//       };
//     }
    
//     const profileData = await response.json();
//     console.log(profileData);

//     return {
//       props: {
//         profileData
//       }
//     };
//   } catch (error) {
//     console.error('Error fetching profile data:', error.message);
//     return {
//       props: {
//         profileData: null // En cas d'erreur, retournez null pour les données du profil
//       }
//     };
//   }
// }


  