import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/group.module.css";
import Group from "../form/group";
import { getMygroups } from "../../handler/getGroup";
import { getUserBySession } from "../../handler/getUserBySession";

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

  const [groupForm, setGroupForm] = useState(false);
  const toggleGroupForm = () => setGroupForm((prevState) => !prevState);

  const [groups , setGroups] = useState()

  const [userid,setuser]=useState()

  useEffect(()=>{
    
    getUserBySession(setuser)
    if (userid?.id) {
    
      getMygroups(userid?.id,setGroups)
    }

  },[userid?.id])

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
     {groups&& <ListGroupManaged group={groups} />}
      {/* create group form */}
      {groupForm && <Group toggleGroupForm={toggleGroupForm} />}
    </div>
  );
}

export function ListGroupManaged({group}) {

console.log(group,"gr");
  
  // const data = [
  //   {
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpx77UG-o7dCcbr3e3t_iqiEY6MwI28q9_Gg&usqp=CAU",
  //     gName: "barca",
  //   },
  //   {
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0xEBCSrW9PyJyQTzxjlBuhHhTak7QdS-X4A&usqp=CAU",
  //     gName: "manchester city",
  //   },
  //   {
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB3g58f-FGw6oXxofzNe_d_w7bX6W4k3rgVw&usqp=CAU",
  //     gName: "manchester united",
  //   },
  //   {
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnlwZFL-qK8R17sDADAGn6aEu940Rwj31H0g&usqp=CAU",
  //     gName: "chelsea",
  //   },
  // ];


 
  return (
    <div className={styles.listGroupManaged}>
      {group.map((item, index) => (
        <div key={index} className={styles.group}>
          <Link href="./profilegroup">
            <img src={`data:image/png;base64,${item.avatarpath} `}alt="" />
            <span>{item.title}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
