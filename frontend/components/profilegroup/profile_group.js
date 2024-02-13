import Link from "next/link";
import styles from "../../styles/modules/profile-group.module.css";
import { useState } from "react";
import Discussion from "./discussions";
import Events from "./events";
import PostGroup from "./post_group";
import ChatGroup from "./chat_group";

export default function Profile_group() {
  const [postForm, setPostForm] = useState(false);

  const [section, setSection] = useState({
    section1: true,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
  });

  const handleSection = ({
    section1,
    section2,
    section3,
    section4,
    section5,
  }) => {
    setSection({ section1, section2, section3, section4, section5 });
  };

  const togglePostForm = () => {
    setPostForm(!postForm);
    section.section1 = true;
    section.section2 = false;
  };

  return (
    <>
      <ContentCovertPhotoGroup
        section={section}
        handleSection={handleSection}
      />
      {section.section1 && <Discussion />}
      {section.section2 && <PostGroup PostForm={togglePostForm} />}
      {section.section3 && <Events />}
      {section.section4 && <ChatGroup />}
    </>
  );
}

export function ContentCovertPhotoGroup({ section, handleSection }) {
  const [stateBtnJoinGroup, setStateBtnJoinGroup] = useState(false);

  const handleStateBtnJoinGroup = (state) => {
    setStateBtnJoinGroup(state);
  };

  return (
    <div className={styles.photoCovert}>
      <img
        src="https://scontent.fdkr6-1.fna.fbcdn.net/v/t39.30808-6/313253877_10160642361074235_7947257140729249691_n.jpg?stp=dst-jpg_s960x960&_nc_cat=103&ccb=1-7&_nc_sid=173fa1&_nc_eui2=AeHS-pL8hG9404bzleqq3HoguhWiboypV-66FaJujKlX7opVFmohOdQkhqcVwsX1KuJG9AiyGlkJhL_Qb9wmvvRZ&_nc_ohc=WPoRNWoiJokAX-ItpOM&_nc_ht=scontent.fdkr6-1.fna&oh=00_AfDrTsxyee2eJb45CgnLSLC4BFb1UAoP8VuRRSf_mUjgBA&oe=65CA881A"
        alt=""
      />
      <h1>Démarches Visa depuis le Sénégal</h1>
      <div className={styles.blocActionGroupType}>
        <div className={styles.groupType}>
          <span>
            <i className="fas fa-globe-africa"></i>Public group ·
          </span>
          <span> 30.9K members</span>
        </div>
        <div className={styles.action}>
          {!stateBtnJoinGroup && (
            <button
              onClick={() => handleStateBtnJoinGroup(true)}
              className={styles.active}
            >
              <i className="fa-solid fa-people-group"></i>Join group
            </button>
          )}
          {stateBtnJoinGroup && (
            <button onClick={() => handleStateBtnJoinGroup(false)}>
              <i className="fa-solid fa-trash"></i>Leave group
            </button>
          )}
          <button>
            <i className="fa-solid fa-plus"></i>Invite
          </button>
        </div>
      </div>
      <NavMenuGroup section={section} handleSection={handleSection} />
    </div>
  );
}

export function NavMenuGroup({ section, handleSection }) {
  const handleClick = (clickedSection) => {
    const newSection = {
      section1: false,
      section2: false,
      section3: false,
      section4: false,
      section5: false,
      [clickedSection]: true,
    };
    handleSection(newSection);
  };

  return (
    <div className={styles.navBlocLeft}>
      <button
        onClick={() => handleClick("section1")}
        className={section.section1 ? styles.activeBtn : ""}
      >
        <i className="fa-solid fa-signs-post"></i>Discussion
      </button>
      <button
        onClick={() => handleClick("section2")}
        className={section.section2 ? styles.activeBtn : ""}
      >
        <i className="fa-solid fa-plus"></i>Add post
      </button>
      <button
        onClick={() => handleClick("section3")}
        className={section.section3 ? styles.activeBtn : ""}
      >
        <i className="fa-brands fa-elementor"></i>Events
      </button>

      <button
        onClick={() => handleClick("section4")}
        className={section.section4 ? styles.activeBtn : ""}
      >
        <i className="fa-solid fa-comment"></i>chat
      </button>
      {/* <button
        onClick={() => handleClick("section5")}
        className={section.section5 ? styles.activeBtn : ""}
      >
        <i className="fa-solid fa-gear"></i>Settings
      </button> */}
    </div>
  );
}
