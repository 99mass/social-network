import { useEffect, useState } from "react";
import styles from "../../styles/modules/group.module.css";
import { MygroupsParticep, getMygroups } from "../../handler/getGroup";
import{getUserBySession} from "../../handler/getUserBySession"
import { defaultImage } from "./group_page";



export default function YourGroup() {

  

  const [groupDiscover, setGroupDiscover] = useState();
  useEffect(() => {
    MygroupsParticep(setGroupDiscover);
    // console.log("setGroupDiscover",groupDiscover);
  }, []);
  

  return (
    <div className={`${styles.menuMiddle} ${styles.YourGroups}`}>
      <div className={styles.contentListYourGroups}>
        {groupDiscover && groupDiscover.map((item, index) => (
          <BuilElementGroup key={index} image={item.avatarpath} gName={item.title} />
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
          <img src={image?`data:image/png;base64,${image}`:defaultImage} alt="" />
          <span>{gName}</span>
        </a>
      </div>
      <a href="./profilegroup" className={styles.view}>
        View group
      </a>
    </div>
  );
}
