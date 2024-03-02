import { useEffect, useState } from "react";
import styles from "../../styles/modules/group.module.css";
import { MygroupsParticep } from "../../handler/getGroup";
import { defaultImage } from "./group_page";
import Link from "next/link";
import { globalSocket } from "../websocket/globalSocket";
import { DisplayPopup } from "../header";


export default function YourGroup() {

  const [socket, setSocket] = useState(null);
  const [nbrNotifChatGroup, setNbrNotifChatGroup] = useState(null);
  const [nbrNotifEventGroup, setNbrNotifEventGroup] = useState(null);
  const [notifMessagesPrivate, setNotifMessagesPrivate] = useState("");
  const [notifMessagesGroup, setNotifMessagesGroup] = useState("");
  const [notifGroupInvitation, setNotifGroupInvitation] = useState("");
  const [notifFollow, setNotifFollow] = useState("");
  const [notifJoinGroupRequest, setNotifJoinGroupRequest] = useState("");
  const [NotifGroupEvent, setNotifGroupEvent] = useState('')

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
        case "nbr_notif_chat_group":
          setNbrNotifChatGroup(_message.content)
          break;
        case "nbr_notif_group_event":
          setNbrNotifEventGroup(_message.content)
          break
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

    }
  })

  const [groupDiscover, setGroupDiscover] = useState();
  useEffect(() => {
    MygroupsParticep(setGroupDiscover);
  }, []);


  return (
    <>
      <div className={`${styles.menuMiddle} ${styles.YourGroups}`}>
        <div className={styles.contentListYourGroups}>
          {groupDiscover && groupDiscover.map((item, index) => {
            // Trouver si le groupe actuel a des notifications de type chat ou Event groupe
            const hasNbrNotifChatGroup = nbrNotifChatGroup?.some(
              (row) => row.group_id === item.id && row.count_join_request > 0
            );
            const hasNbrNotifEventGroup = nbrNotifEventGroup?.some(
              (row) => row.group_id === item.id && row.count_join_request > 0
            );
            return (
              <BuilElementGroup key={`${item.id}${index}`} image={item.avatarpath} gName={item.title} groudId={item.id} hasNbrNotifChatGroup={hasNbrNotifChatGroup} hasNbrNotifEventGroup={hasNbrNotifEventGroup} />
            )
          })}
        </div>
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

export function BuilElementGroup({ image, gName, groudId, hasNbrNotifChatGroup,hasNbrNotifEventGroup }) {
  return (
    <div className={styles.elementGroup}>
      <div className={styles.topElement}>
        <Link href={`./profilegroup/?id=${groudId}`}>
          <img src={image ? `data:image/png;base64,${image}` : defaultImage} alt="" />
          <span>{gName}</span>
          {(hasNbrNotifChatGroup || hasNbrNotifEventGroup) && <img className={`${styles.imgNew} imgNew`} src="../images/new.png" alt="" />}
        </Link>

      </div>
      <Link href={`./profilegroup/?id=${groudId}`} className={styles.view}>
        View group
      </Link>

    </div>
  );
}
