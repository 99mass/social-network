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
  const [nbrnotifMessagesPrivate, setNbrNotifMessagesPrivate] = useState(0);
  const [nbrNotifFollow, setNbrNotifFollow] = useState(0);
  const [totalGroupNotif, setTotalGroupNotif] = useState(0);
  const [notifMessagesPrivate, setNotifMessagesPrivate] = useState("");
  const [notifMessagesGroup, setNotifMessagesGroup] = useState("");
  const [notifGroupInvitation, setNotifGroupInvitation] = useState("");
  const [notifFollow, setNotifFollow] = useState("");
  const [notifJoinGroupRequest, setNotifJoinGroupRequest] = useState("");
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
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        globalSocket(setSocket);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket opened from header component");
    };

    socket.onmessage = (event) => {
      const _message = event.data && JSON.parse(event.data);
      if (!_message) return;

      switch (_message.type) {
        // old notifications
        case "nbr_notif_message":
          if (router.route !== "/chatpage") {
            setNbrNotifMessagesPrivate(_message.content);
          }
          break;
        case "nbr_notif_follow":
          setNbrNotifFollow(_message.content);
          break;
        case "total_group_notif":
          setTotalGroupNotif(_message.content);
          break;

        // now notifications
        case "notif_private_message":
          if (router.route !== "/chatpage") { setNotifMessagesPrivate(_message); }
          break;
        case "notif_chat_group":
          setNotifMessagesGroup(_message);
          break;
        case "notif_follow_request":
          setNotifFollow(_message);
          break;
        case "notif_group_invitation_request":
          setNotifGroupInvitation(_message);
          break;
        case "notif_join_group_request":
          setNotifJoinGroupRequest(_message);
          break;
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
                nbrnotifMessagesPrivate={nbrnotifMessagesPrivate}
                totalGroupNotif={totalGroupNotif}
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
              nbrnotifMessagesPrivate={nbrnotifMessagesPrivate}
              totalGroupNotif={totalGroupNotif}
              nbrNotifFollow={nbrNotifFollow}
            />
          </div>
        </div>
      </nav>
      {postForm && (
        <Post togglePostForm={togglePostForm} setPostForm={setPostFrom} />
      )}
      {groupForm && <Group toggleGroupForm={toggleGroupForm} />}
      <DisplayPopup
        notifMessagesPrivate={notifMessagesPrivate}
        notifFollow={notifFollow}
        notifJoinGroupRequest={notifJoinGroupRequest}
        notifGroupInvitation={notifGroupInvitation}
        notifMessagesGroup={notifMessagesGroup}
        setNotifMessagesPrivate={setNotifMessagesPrivate}
        setNotifJoinGroupRequest={setNotifJoinGroupRequest}
        setNotifGroupInvitation={setNotifGroupInvitation}
        setNotifFollow={setNotifFollow}
        setNotifMessagesGroup={setNotifMessagesGroup}
      />
    </>
  );
}

export function MidlleNAvForBigScreen({
  nbrnotifMessagesPrivate,
  totalGroupNotif,
  nbrNotifFollow,
}) {
  return (
    <div className={`${styles.middleContent} ${styles.middleContent0}`}>
      <Link href="/home">
        <i className="active fas fa-home" title="Home"></i>
      </Link>
      <Link href="/friend">
        <i className="fas fa-user-friends" title="Friend Requests">
          {nbrNotifFollow > 0 && <span>{nbrNotifFollow}+</span>}
        </i>
      </Link>
      <Link href="/chat">
        <i className="fas fa-comment" title="Chat">
          {nbrnotifMessagesPrivate > 0 && (
            <span>{nbrnotifMessagesPrivate}+</span>
          )}
        </i>
      </Link>
      <Link href="/group" title="Groups">
        <i className="fas fa-users">
          {totalGroupNotif > 0 && <span>{totalGroupNotif}+</span>}
        </i>
      </Link>
    </div>
  );
}
export function MidlleNAvFormSmallScreen({
  nbrnotifMessagesPrivate,
  totalGroupNotif,
  nbrNotifFollow,
}) {
  return (
    <div className={`${styles.middleContent} ${styles.middleContent1}`}>
      <Link href="/home">
        <i className="active fas fa-home"></i>
      </Link>
      <Link href="/friend">
        <i className="fas fa-user-friends">
          {nbrNotifFollow > 0 && <span>{nbrNotifFollow}+</span>}
        </i>
      </Link>
      <Link href="/chat">
        <i className="fas fa-comment">
          {nbrnotifMessagesPrivate > 0 && (
            <span>{nbrnotifMessagesPrivate}+</span>
          )}
        </i>
      </Link>
      <Link href="/group">
        <i className="fas fa-users">
          {totalGroupNotif > 0 && <span>{totalGroupNotif}+</span>}
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


export function DisplayPopup({
  notifMessagesPrivate,
  notifFollow,
  notifJoinGroupRequest,
  notifGroupInvitation,
  notifMessagesGroup,
  setNotifMessagesPrivate,
  setNotifJoinGroupRequest,
  setNotifGroupInvitation,
  setNotifFollow,
  setNotifMessagesGroup
}) {
  return (
    <>

      {notifMessagesPrivate && (
        <ToastNotification
          type={notifMessagesPrivate.type.replaceAll("_", " ") + "!"}
          text={"has just sent you a new private message"}
          sender={notifMessagesPrivate.content.sender}
          group={""}
          setCloseState={setNotifMessagesPrivate}
        />
      )}
      {notifJoinGroupRequest && (
        <ToastNotification
          type={notifJoinGroupRequest.type.replaceAll("_", " ") + " !"}
          text={"requests permission to be a member of your group"}
          sender={notifJoinGroupRequest.content.sender}
          group={notifJoinGroupRequest.content.group}
          setCloseState={setNotifJoinGroupRequest}
        />
      )}
      {notifGroupInvitation && (
        <ToastNotification
          type={notifGroupInvitation.type.replaceAll("_", " ") + " !"}
          text={"invites you to join the group"}
          sender={notifGroupInvitation.content.sender}
          group={notifGroupInvitation.content.group}
          setCloseState={setNotifGroupInvitation}
        />
      )}
      {notifFollow && (
        <ToastNotification
          type={notifFollow.type.replaceAll("_", " ") + " !"}
          text={"has just sent you a friend request"}
          sender={notifFollow.content.sender}
          group={""}
          setCloseState={setNotifFollow}
        />
      )}
      {notifMessagesGroup && (
        <ToastNotification
          type={notifMessagesGroup.type.replaceAll("_", " ") + " !"}
          text={"has just sent a message in the group"}
          sender={notifMessagesGroup.content.sender}
          group={notifMessagesGroup.content.group}
          setCloseState={setNotifMessagesGroup}
        />
      )}
    </>
  )
}

export function ToastNotification({
  type,
  text,
  sender,
  group,
  setCloseState,
}) {
  const closeToast = () => setCloseState("");
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <svg
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          fill="#299443"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <title>new-star</title>
            <g id="Layer_2" data-name="Layer 2">
              <g id="invisible_box" data-name="invisible box">
                <rect width="48" height="48" fill="none"></rect>
              </g>
              <g id="icons_Q2" data-name="icons Q2">
                <path d="M42.3,24l3.4-5.1a2,2,0,0,0,.2-1.7A1.8,1.8,0,0,0,44.7,16l-5.9-2.4-.5-5.9a2.1,2.1,0,0,0-.7-1.5,2,2,0,0,0-1.7-.3L29.6,7.2,25.5,2.6a2.2,2.2,0,0,0-3,0L18.4,7.2,12.1,5.9a2,2,0,0,0-1.7.3,2.1,2.1,0,0,0-.7,1.5l-.5,5.9L3.3,16a1.8,1.8,0,0,0-1.2,1.2,2,2,0,0,0,.2,1.7L5.7,24,2.3,29.1a2,2,0,0,0,1,2.9l5.9,2.4.5,5.9a2.1,2.1,0,0,0,.7,1.5,2,2,0,0,0,1.7.3l6.3-1.3,4.1,4.5a2,2,0,0,0,3,0l4.1-4.5,6.3,1.3a2,2,0,0,0,1.7-.3,2.1,2.1,0,0,0,.7-1.5l.5-5.9L44.7,32a2,2,0,0,0,1-2.9ZM18,31.1l-4.2-3.2L12.7,27h-.1l.6,1.4,1.7,4-2.1.8L9.3,24.6l2.1-.8L15.7,27l1.1.9h0a11.8,11.8,0,0,0-.6-1.3l-1.6-4.1,2.1-.9,3.5,8.6Zm3.3-1.3-3.5-8.7,6.6-2.6.7,1.8L20.7,22l.6,1.6L25.1,22l.7,1.7L22,25.2l.7,1.9,4.5-1.8.7,1.8Zm13.9-5.7-2.6-3.7-.9-1.5h-.1a14.7,14.7,0,0,1,.4,1.7l.8,4.5-2.1.9-5.9-7.7,2.2-.9,2.3,3.3,1.3,2h0a22.4,22.4,0,0,1-.4-2.3l-.7-4,2-.8L33.8,19,35,20.9h0s-.2-1.4-.4-2.4L34,14.6l2.1-.9,1.2,9.6Z"></path>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{type}</span>
        <div className={styles.desc}>
          <span className={styles.sender}> {sender}</span> {text}{" "}
          <span className={styles.sender}> {group}</span>.
        </div>
      </div>
      <button type="button" className={styles.close} onClick={closeToast}>
        <svg
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
}
