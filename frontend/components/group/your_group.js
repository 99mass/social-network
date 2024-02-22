import { useEffect, useState } from "react";
import styles from "../../styles/modules/group.module.css";
import { MygroupsParticep } from "../../handler/getGroup";
import { defaultImage } from "./group_page";



export default function YourGroup() {

  

  const [groupDiscover, setGroupDiscover] = useState();
  useEffect(() => {
    MygroupsParticep(setGroupDiscover);
  }, []);
  

  return (
    <div className={`${styles.menuMiddle} ${styles.YourGroups}`}>
      <div className={styles.contentListYourGroups}>
        {groupDiscover && groupDiscover.map((item, index) => (
          <BuilElementGroup key={index} id={item.id} image={item.avatarpath} gName={item.title} />
        ))}
      </div>
    </div>
  );
}

export function BuilElementGroup({id, image, gName }) {
  return (
    <div className={styles.elementGroup}>
      <div className={styles.topElement}>
        <a href={`./profilegroup?groupid=${id}`}>
          <img src={image?`data:image/png;base64,${image}`:defaultImage} alt="" />
          <span>{gName}</span>
        </a>
      </div>
      <a href={`./profilegroup?groupid=${id}`} className={styles.view}>
        View group
      </a>
    </div>
  );
}
