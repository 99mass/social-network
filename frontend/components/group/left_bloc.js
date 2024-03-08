import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/group.module.css";
import Group from "../form/group";
import { getMygroups } from "../../handler/getGroup";
import { defaultImage } from "./group_page";
import { globalSocket } from "../websocket/globalSocket";
import { DisplayPopup } from "../header";

export default function LeftBlocGroupPage({ state, handleState }) {


  const [groups, setGroups] = useState();
  const [groupForm, setGroupForm] = useState(false);
  const [hasHighNbrNotifChatGroup, setHasHighbrNotifChatGroup] = useState(false);
  const [hasHighbrNotifEventGroup, setHasHighbrNotifEventGroup] = useState(false);
  const [nbrNotifInvitationGroup, setNbrNotifInvitationGroup] = useState(0);
  const [nbrNotifJoinGroupRequest, setNbrJoinGroupRequest] = useState([]);
  const [notifMessagesPrivate, setNotifMessagesPrivate] = useState("");
  const [notifMessagesGroup, setNotifMessagesGroup] = useState("");
  const [notifGroupInvitation, setNotifGroupInvitation] = useState("");
  const [notifFollow, setNotifFollow] = useState("");
  const [notifJoinGroupRequest, setNotifJoinGroupRequest] = useState("");
  const [NotifGroupEvent, setNotifGroupEvent] = useState('')

  const [socket, setSocket] = useState(null);

  const handleClick = (clickedState) => {
    const newState = {
      state1: false,
      state2: false,
      state3: false,
      state4: false,
      [clickedState]: true,
    };
    handleState(newState);
  };

  useEffect(() => {
    getMygroups(setGroups);
  }, []);

  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      globalSocket(setSocket);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket opened from lefblock group component");
    };

    socket.onmessage = (event) => {
      const _message = event.data && JSON.parse(event.data);

      if (!_message) return;
      switch (_message.type) {
        case "nbr_notif_join_group_request":
          if (_message.content && _message.content.length > 0)
            setNbrJoinGroupRequest(_message.content);
          break;
        case "nbr_notif_group_event":
          if (_message.content && _message.content.length > 0) {
            // Vérifier si on de nouveau event non lue
            const hasEvents = _message.content.some(
              (row) => row.count_join_request >= 1
            );
            setHasHighbrNotifEventGroup(hasEvents);
          }
          break;
        case "nbr_notif_chat_group":
          if (_message.content && _message.content.length > 0) {
            // Vérifier si on un message chat group non lue
            const hasHighRequest = _message.content.some(
              (row) => row.count_join_request >= 1
            );
            setHasHighbrNotifChatGroup(hasHighRequest);
          }
          break;
        case "nbr_notif_group_invitation":
          setNbrNotifInvitationGroup(_message.content);
          break;
        // now notifications
        case "notif_private_message":
          setNotifMessagesPrivate(_message);
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
        case "notif_group_event":
          setNotifGroupEvent(_message);
          break
      }
    };
  }, [socket]);

  const toggleGroupForm = () => setGroupForm((prevState) => !prevState);

  return (
    <>
      <div className={styles.menuLeft}>
        <h2>Groups</h2>
        <div className={styles.blocNav}>
          <h4
            onClick={() => handleClick("state1")}
            className={state.state1 ? styles.active : ""}
          >
            <i className="fa-solid fa-mobile-screen"></i>your feed
          </h4>
          <h4
            onClick={() => handleClick("state2")}
            className={state.state2 ? styles.active : ""}
          >
            <i className="fa-regular fa-compass"></i>discover
          </h4>
          <h4
            onClick={() => handleClick("state3")}
            className={`${styles.imgNew} ${state.state3 ? styles.active : ""}`}
          >
            <span>
              <i className="fa-solid fa-people-group"></i>your groups
            </span>
            {(hasHighNbrNotifChatGroup || hasHighbrNotifEventGroup) && <img src="../images/new.png" alt="" />}
          </h4>
          <h4
            onClick={() => handleClick("state4")}
            className={`${styles.imgNew} ${state.state4 ? styles.active : ""}`}
          >
            <span>
              <i className="fa-solid fa-wand-sparkles"></i>request groups
            </span>
            {nbrNotifInvitationGroup > 0 && (
              <img src="../images/new.png" alt="" />
            )}
          </h4>
        </div>
        <Link href="" onClick={toggleGroupForm} className={styles.btnNewGroup}>
          <i className="fa-solid fa-plus"></i>create new group
        </Link>
        <hr />
        <h4 className={styles.h4ListGroupManaged}>Groups you manage</h4>
        {groupForm && (
          <Group toggleGroupForm={toggleGroupForm} setGroups={setGroups} setGroupForm={setGroupForm} />
        )}
        {groups && (
          <ListGroupManaged
            group={groups}
            nbrNotifJoinGroupRequest={nbrNotifJoinGroupRequest}
          />
        )}
      </div>
      <DisplayPopup
        notifMessagesPrivate={notifMessagesPrivate}
        notifFollow={notifFollow}
        notifJoinGroupRequest={notifJoinGroupRequest}
        notifGroupInvitation={notifGroupInvitation}
        notifMessagesGroup={notifMessagesGroup}
        NotifGroupEvent={NotifGroupEvent}
        setNotifMessagesPrivate={setNotifMessagesPrivate}
        setNotifJoinGroupRequest={setNotifJoinGroupRequest}
        setNotifGroupInvitation={setNotifGroupInvitation}
        setNotifFollow={setNotifFollow}
        setNotifMessagesGroup={setNotifMessagesGroup}
        setNotifGroupEvent={setNotifGroupEvent}
      />
    </>
  );
}

export function ListGroupManaged({ group, nbrNotifJoinGroupRequest }) {
  return (
    <div className={styles.listGroupManaged}>
      {group &&
        group.map((item, index) => {
          // Trouver si le groupe actuel a des notifications de demande de rejointure
          const hasJoinRequestNotifications = nbrNotifJoinGroupRequest.some(
            (row) => row.group_id === item.id && row.count_join_request > 0
          );

          return (
            <div key={index} className={styles.group}>
              <Link href={`./profilegroup?id=${item.id}`}>
                <img
                  src={
                    item.avatarpath
                      ? `data:image/png;base64,${item.avatarpath} `
                      : defaultImage
                  }
                  alt=""
                />
                <span>
                  {item.title}
                  {hasJoinRequestNotifications && (
                    <img
                      className={styles.notifJoinGroup}
                      src="../images/new.png"
                      alt=""
                    />
                  )}
                </span>
              </Link>
            </div>
          );
        })}
    </div>
  );
}
