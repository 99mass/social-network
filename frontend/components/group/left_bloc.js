// import { useEffect, useState } from "react";
// import Link from "next/link";
// import styles from "../../styles/modules/group.module.css";
// import Group from "../form/group";
// import { getMygroups } from "../../handler/getGroup";
// import { defaultImage } from "./group_page";
// import { useRouter } from "next/router";
// import { globalSocket } from "../websocket/globalSocket";

// export default function LeftBlocGroupPage({ state, handleState }) {
//   const handleClick = (clickedState) => {
//     const newState = {
//       state1: false,
//       state2: false,
//       state3: false,
//       state4: false,
//       [clickedState]: true,
//     };
//     handleState(newState);
//   };

//   const [groups, setGroups] = useState();
//   const [groupForm, setGroupForm] = useState(false);

//   const [nbrNotifFollow, setNbrNotifFollow] = useState(0);
//   const [socket, setSocket] = useState(null);

//   const router = useRouter()

//   useEffect(() => {
//     getMygroups(setGroups);
//   }, []);

//   useEffect(() => {
//     // getUserBySession(setDatasUser);
//     const timer = setTimeout(() => {
//       if (!socket || socket.readyState !== WebSocket.OPEN) {
//         if (router.route !== "/chatpage") globalSocket(setSocket);
//       }
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!socket) return;
//     socket.onopen = () => {
//       console.log("WebSocket opened from lefblock group component");
//     };

//     socket.onmessage = (event) => {
//       const _message = event.data && JSON.parse(event.data);
//       console.log(_message,"mess");
//       if (!_message) return;

//       if (_message.types === "notif_join_group_request") {
//         // setNbrNotifFollow(_message.content);
//         setNbrNotifFollow(prevNbrNotifFollow => prevNbrNotifFollow +  1);

//       }
//       // }
//     };
//   }, [socket]);
//   const toggleGroupForm = () => setGroupForm((prevState) => !prevState);

//   return (
//     <div className={styles.menuLeft}>
//       <h2>Groups</h2>
//       <div className={styles.blocNav}>
//         <h4
//           onClick={() => handleClick("state1")}
//           className={state.state1 ? styles.active : ""}
//         >
//           <i className="fa-solid fa-mobile-screen"></i>your feed
//         </h4>
//         <h4
//           onClick={() => handleClick("state2")}
//           className={state.state2 ? styles.active : ""}
//         >
//           <i className="fa-regular fa-compass"></i>discover
//         </h4>
//         <h4
//           onClick={() => handleClick("state3")}
//           className={state.state3 ? styles.active : ""}
//         >
//           <i className="fa-solid fa-people-group"></i>your groups
//         </h4>
//         <h4
//           onClick={() => handleClick("state4")}
//           className={state.state4 ? styles.active : ""}
//         >
//           <i className="fa-solid fa-wand-sparkles"></i>request groups
//         </h4>
//       </div>
//       <Link href="" onClick={toggleGroupForm} className={styles.btnNewGroup}>
//         <i className="fa-solid fa-plus"></i>create new group
//       </Link>
//       <hr />
//       <h4 className={styles.h4ListGroupManaged}>Groups you manage</h4>
//       {/* create group form */}
//       {groupForm && <Group toggleGroupForm={toggleGroupForm} setGroups={setGroups} />}

//       { groups &&   <ListGroupManaged

//          group={groups}
//            nbrNotifFollow={nbrNotifFollow}
//        />}
//     </div>
//   );
// }

// export function ListGroupManaged({ group,nbrNotifFollow }) {
//   // const defaultImage = "../images/groups-defaul.png";

//   return (
//     <div className={styles.listGroupManaged}>
//       {group.map((item, index) => (
//         <div key={index} className={styles.group}>
//           <Link href={`./profilegroup?id=${item.id}`}>
//             <img src={item.avatarpath?`data:image/png;base64,${item.avatarpath} `: defaultImage} alt="" />
//             <span>{item.title}
//             {nbrNotifFollow > 0 && <span>{nbrNotifFollow}+</span>}

//             </span>
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/group.module.css";
import Group from "../form/group";
import { getMygroups } from "../../handler/getGroup";
import { defaultImage } from "./group_page";
import { useRouter } from "next/router";
import { globalSocket } from "../websocket/globalSocket";

export default function LeftBlocGroupPage({ state, handleState }) {
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

  const [groups, setGroups] = useState();
  const [groupForm, setGroupForm] = useState(false);
  const [nbrNotifChatGroup, setNbrNotifChatGroup] = useState(0);
  const [nbrNotifFollow, setNbrNotifFollow] = useState(0);
  const [socket, setSocket] = useState(null);

  const router = useRouter();

  useEffect(() => {
    getMygroups(setGroups);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        if (router.route !== "/chatpage") globalSocket(setSocket);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onopen = () => {
      console.log("WebSocket opened from lefblock group component");
    };

    socket.onmessage = (event) => {
      const _message = event.data && JSON.parse(event.data);
      // console.log(_message,"mess");
      if (!_message) return;
      switch (_message.type) {
        case "nbr_notif_join_group_request":
          if (_message.content && Array.isArray(_message.content)) {
            const content = _message.content[0];
            const countJoinReq = content.CountJoinReq;
            setNbrNotifFollow(countJoinReq);
          }
          break;
        case "nbr_notif_chat_group":
          break;

        default:
          break;
      }
    };
  }, [socket]);

  const toggleGroupForm = () => setGroupForm((prevState) => !prevState);

  return (
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
          className={state.state3 ? styles.active : ""}
        >
          <i className="fa-solid fa-people-group"></i>your groups
        </h4>
        <h4
          onClick={() => handleClick("state4")}
          className={state.state4 ? styles.active : ""}
        >
          <i className="fa-solid fa-wand-sparkles"></i>request groups
        </h4>
      </div>
      <Link href="" onClick={toggleGroupForm} className={styles.btnNewGroup}>
        <i className="fa-solid fa-plus"></i>create new group
      </Link>
      <hr />
      <h4 className={styles.h4ListGroupManaged}>Groups you manage</h4>
      {groupForm && (
        <Group toggleGroupForm={toggleGroupForm} setGroups={setGroups} />
      )}
      {groups && (
        <ListGroupManaged group={groups} nbrNotifFollow={nbrNotifFollow} />
      )}
    </div>
  );
}

export function ListGroupManaged({ group, nbrNotifFollow }) {
  return (
    <div className={styles.listGroupManaged}>
      {group.map((item, index) => (
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
              {nbrNotifFollow > 0 && (
                <span className={styles.notifGroup}>{nbrNotifFollow}+</span>
              )}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
