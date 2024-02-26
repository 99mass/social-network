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
  const [notifMessagesPrivate, setNotifMessagesPrivate] = useState(0);
  const [nbrNotifGroupInvitation, setNbrNotifGroupInvitation] = useState(0);
  const [nbrNotifFollow, setNbrNotifFollow] = useState(0);

  const router = useRouter();

  const handlerLogOut = async () => {
    const isLogOut = await logout();
    if (isLogOut) {
      router.push("/");
    }
  };

  useEffect(() => {
    getUserBySession(setDatasUser);
    const timer = setTimeout(() => {
      if (router.route !== "/chatpage") globalSocket(setSocket);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket opened from header component");
    };

    socket.onmessage = (event) => {
      const _message = JSON.parse(event.data);
      console.log("mess", _message);
      if (!_message) return;

      if (_message.type === "nbr_notif_message") {
        setNotifMessagesPrivate(_message.content);
        console.log("nbr_notif_message:", _message.content);
      }
      if (_message.type === "nbr_notif_join_group_request") {
        setNbrNotifGroupInvitation(_message.content);
        console.log("nbrNotifJoinGroupRequest:", _message.content);
      }
      if (_message.type === "nbr_notif_follow") {
        setNbrNotifFollow(_message.content);
        console.log("nbr_notif_follow:", _message.content);
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
              <MidlleNAvForBigScreen
                notifMessagesPrivate={notifMessagesPrivate}
                nbrNotifGroupInvitation={nbrNotifGroupInvitation}
                nbrNotifFollow={nbrNotifFollow}
              />
              <ToggleButton
                togglePostForm={togglePostForm}
                toggleGroupForm={toggleGroupForm}
                handlerLogOut={handlerLogOut}
                firstname={datasUser?.firstname}
                lastname={datasUser?.lastname}
                userId={datasUser?.id}
              />
            </div>
            <MidlleNAvFormSmallScreen
              notifMessagesPrivate={notifMessagesPrivate}
              nbrNotifGroupInvitation={nbrNotifGroupInvitation}
              nbrNotifFollow={nbrNotifFollow}
            />
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

export function MidlleNAvForBigScreen({
  notifMessagesPrivate,
  nbrNotifGroupInvitation,
  nbrNotifFollow,
}) {
  return (
    <div className={`${styles.middleContent} ${styles.middleContent0}`}>
      <Link href="/home">
        <i className="active fas fa-home" title="Home">
          {/* <span>25+</span> */}
        </i>
      </Link>
      <Link href="/friend">
        <i className="fas fa-user-friends" title="Friend Requests">
          {nbrNotifFollow > 0 && <span>{nbrNotifFollow}+</span>}
        </i>
      </Link>
      <Link href="/chat">
        <i className="fas fa-comment" title="Chat">
          {notifMessagesPrivate > 0 && <span>{notifMessagesPrivate}+</span>}
        </i>
      </Link>
      {/* <Link href="/notification">
        <i className="fas fa-bell" title="Notification">
          <span>22+</span>
        </i>
      </Link> */}
      <Link href="/group" title="Groups">
        <i className="fas fa-users">
          {nbrNotifGroupInvitation > 0 && (
            <span>{nbrNotifGroupInvitation}+</span>
          )}
        </i>
      </Link>
    </div>
  );
}
export function MidlleNAvFormSmallScreen({
  notifMessagesPrivate,
  nbrNotifGroupInvitation,
  nbrNotifFollow,
}) {
  return (
    <div className={`${styles.middleContent} ${styles.middleContent1}`}>
      <Link href="/home">
        <i className="active fas fa-home">{/* <span>25+</span> */}</i>
      </Link>
      <Link href="/friend">
        <i className="fas fa-user-friends">
          {nbrNotifFollow > 0 && <span>{nbrNotifFollow}+</span>}
        </i>
      </Link>
      <Link href="/chat">
        <i className="fas fa-comment">
          {notifMessagesPrivate > 0 && <span>{notifMessagesPrivate}+</span>}
        </i>
      </Link>
      {/* <Link href="/notification">
        <i className="fas fa-bell">
          <span>22+</span>
        </i>
      </Link> */}
      <Link href="/group">
        <i className="fas fa-users">
          {nbrNotifGroupInvitation > 0 && (
            <span>{nbrNotifGroupInvitation}+</span>
          )}
        </i>
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

function Notification() {

  return (
    <div className={styles.toastContainer} id={styles.toast}>
      <span className={styles.toastClose} onclick="closeToast()">
        &times;
      </span>
      <div className={styles.toastHeader} id={styles.toastHeader}>
        {/* <!-- SVG and Header content will be dynamically inserted here --> */}
      </div>
      <div className={styles.txtblk} id={styles.txtBlock}>
        {/* <!-- Text block content will be dynamically inserted here --> */}
      </div>
      <div className={styles.toastBody} id={styles.toastBody}>
        {/* <!-- Dynamic content will be inserted here --> */}
      </div>
    </div>
  );
}
