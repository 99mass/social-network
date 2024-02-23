import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/modules/Header.module.css";

import Post from "./form/post";
import Group from "./form/group";
import { logout } from "../handler/logout";
import { getUserBySession } from "../handler/getUserBySession";
import { globalSocket } from "./websocket/globalSocket";

export default function Header() {
  const [datasUser, setDatasUser] = useState(null);
  const [postForm, setPostFrom] = useState(false);
  const [groupForm, setGroupFrom] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notifMessages, setNotifMessages] = useState(false);

  const router = useRouter();

  const handlerLogOut = async () => {
    const isLogOut = await logout();
    if (isLogOut) {
      router.push("/");
    }
  };
  console.log(router.route);
  useEffect(() => {
    getUserBySession(setDatasUser);
    const timer = setTimeout(() => {
     if(router.route!=="/chatpage") globalSocket(setSocket);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket privateMessage opened");
    };

    socket.onmessage = (event) => {
      const _message = JSON.parse(event.data);
      console.log("mess",_message);
      if (_message && _message.type === "notif_private_message") {
        setNotifMessages(true);
      }
    };
  }, [socket]);

  const togglePostForm = () => setPostFrom((prevState) => !prevState);
  const toggleGroupForm = () => setGroupFrom((prevState) => !prevState);

  return (
    <>
      <nav className={styles.top}>
        <div className={styles.fixed}>
          <div className={styles.mainHeader}>
            <div className={styles.topContent}>
              <Link href="/home">
                <h2>social-network</h2>
              </Link>
              <MidlleNAvForBigScreen  notifMessages={notifMessages} />
              <ToggleButton
                togglePostForm={togglePostForm}
                toggleGroupForm={toggleGroupForm}
                handlerLogOut={handlerLogOut}
                firstname={datasUser?.firstname}
                lastname={datasUser?.lastname}
                userId={datasUser?.id}
              />
            </div>
            <MidlleNAvFormSmallScreen  notifMessages={notifMessages}/>
          </div>
        </div>
      </nav>
      {postForm && (
        <Post togglePostForm={togglePostForm} setPostForm={setPostFrom} />
      )}
      {groupForm && <Group toggleGroupForm={toggleGroupForm} />}
    </>
  );
}

export function MidlleNAvForBigScreen({notifMessages}) {
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
          {notifMessages && <span>22+</span>}
        </i>
      </Link>
      <Link href="/group" title="Groups">
        <i className="fas fa-users"></i>
      </Link>
    </div>
  );
}
export function MidlleNAvFormSmallScreen({notifMessages}) {
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
        {notifMessages && <span>42</span>}
        </i>
      </Link>
      <Link href="/notification">
        <i className="fas fa-bell">
          <span>22+</span>
        </i>
      </Link>
      <Link href="/group">
        <i className="fas fa-users"></i>
      </Link>
    </div>
  );
}

export function ToggleButton({
  togglePostForm,
  toggleGroupForm,
  handlerLogOut,
  firstname,
  lastname,
  userId,
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleToggleClick = () => {
    setMenuOpen(!isMenuOpen);
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
              <Link href={`./profileuser?userid=${userId}`}>
                <i className="fa-regular fa-user"></i>
                {`${firstname} ${lastname}`}
              </Link>
            </li>
            <li onClick={togglePostForm}>
              <i className="fa-solid fa-pen-to-square"></i>Create post
            </li>
            <li onClick={toggleGroupForm}>
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
    </>
  );
}
