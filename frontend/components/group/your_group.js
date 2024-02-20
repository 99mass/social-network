import { useEffect, useState } from "react";
import styles from "../../styles/modules/group.module.css";
import { getMygroups } from "../../handler/getGroup";
import{getUserBySession} from "../../handler/getUserBySession"

export default function YourGroup() {


  const [groups , setGroups] = useState()

  const [userid,setuser]=useState()

  useEffect(()=>{
    
    getUserBySession(setuser)
    if (userid?.id) {
      
      getMygroups(userid?.id,setGroups)
    }

  })
  // const data = [
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1611393972804-1b38bddd4e40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9ydW18ZW58MHx8MHx8fDA%3D",
  //     gName: "group-name",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1652688731647-dd5a21a88465?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8",
  //     gName: "group-name",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1620924049153-4d32fcbe88fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmV3fGVufDB8fDB8fHww",
  //     gName: "group-name",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JvdXB8ZW58MHx8MHx8fDA%3D",
  //     gName: "group-name",
  //   },
  // ];

  return (
    <div className={`${styles.menuMiddle} ${styles.YourGroups}`}>
      <div className={styles.contentListYourGroups}>
        {data.map((item, index) => (
          <BuilElementGroup key={index} image={item.image} gName={item.gName} />
        ))}
      </div>
    </div>
  );
}

export function BuilElementGroup({ image, gName }) {
  return (
    <div className={styles.elementGroup}>
      <div className={styles.topElement}>
        <a href="./profilegroup">
          <img src={image} alt="" />
          <span>{gName}</span>
        </a>
      </div>
      <a href="./profilegroup" className={styles.view}>
        View group
      </a>
    </div>
  );
}
