import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/modules/Header.module.css";

import Post from "./form/post";
import Group from "./form/group";
import { logout } from "../handler/logout";

export default function Header() {
  const router = useRouter();

  return (
    <nav className={styles.top}>
      <div className={styles.fixed}>
        <div className={styles.mainHeader}>
          <div className={styles.topContent}>
            <h2>social-network</h2>
            <MidlleNAvForBigScreen />
            <ToggleButton router={router} />
          </div>
          <MidlleNAvFormSmallScreen />
        </div>
      </div>
    </nav>
  );
}

export function MidlleNAvForBigScreen() {
  return (
    <div className={`${styles.middleContent} ${styles.middleContent0}`}>
      <Link href="/home">
        <i className="active fas fa-home" title="Home">
          <span>25+</span>
        </i>
      </Link>
      <Link href="/friend">
        <i className="fas fa-user-friends" title="Friend Requests">
          <span>4+</span>
        </i>
      </Link>
      <Link href="/chat">
        <i className="fas fa-comment" title="Chat">
          <span> 42</span>
        </i>
      </Link>
      <Link href="/notification">
        <i className="fas fa-bell" title="Notification">
          <span>22+</span>
        </i>
      </Link>
      <Link href="/group" title="Groups">
        {" "}
        <i className="fas fa-users"></i>
      </Link>
    </div>
  );
}
export function MidlleNAvFormSmallScreen() {
  return (
    <div className={`${styles.middleContent} ${styles.middleContent1}`}>
      <Link href="/home">
        <i className="active fas fa-home">
          <span>25+</span>
        </i>
      </Link>
      <Link href="/friend">
        <i className="fas fa-user-friends">
          <span>4+</span>
        </i>
      </Link>
      <Link href="/chat">
        <i className="fas fa-comment">
          <span>42</span>
        </i>
      </Link>
      <Link href="/notification">
        <i className="fas fa-bell">
          <span>22+</span>
        </i>
      </Link>
      <Link href="/group">
        {" "}
        <i className="fas fa-users"></i>
      </Link>
    </div>
  );
}

export function ToggleButton({ router }) {
  const [postForm, setPostFrom] = useState(false);
  const [groupForm, setGroupFrom] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  // affichages des formulaires
  const PostForm = () => {
    if (!postForm) {
      setPostFrom(true);
    } else {
      setPostFrom(false);
    }
  };
  const GroupForm = () => {
    if (!groupForm) {
      setGroupFrom(true);
    } else {
      setGroupFrom(false);
    }
  };
  const handleToggleClick = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handlerLogOut = () => {
    const checkLogOut = async () => {
      const isLogOut = await logout();
      if (isLogOut) {
        router.push("/");
      }
    };
    checkLogOut();
  };

  return (
    <>
      <div className={styles.topContentIcons}>
        <i className="fas fa-bars" onClick={handleToggleClick}></i>
      </div>
      {isMenuOpen && (
        <div className={styles.dropdownMenu}>
          <ul>
            <li>
              <Link href="/profileuser">
                <i className="fa-regular fa-user"></i>Profile
              </Link>{" "}
            </li>
            <li onClick={PostForm}>
              {" "}
              <i className="fa-solid fa-pen-to-square"></i>Create post
            </li>
            <li onClick={GroupForm}>
              {" "}
              <i className="fa-solid fa-users"></i>Create group
            </li>
            <li onClick={handlerLogOut}>
              <Link href="">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>log out
              </Link>
            </li>
          </ul>
        </div>
      )}
      {postForm && <Post PostForm={PostForm} />}
      {groupForm && <Group GroupForm={GroupForm} />}
    </>
  );
}
