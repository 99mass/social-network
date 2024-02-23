import { useEffect, useState } from "react";
import styles from "../../styles/modules/group.module.css";
import { MygroupsParticep } from "../../handler/getGroup";
import { defaultImage } from "./group_page";
import Link from "next/link";


export default function YourGroup() {

  

  const [groupDiscover, setGroupDiscover] = useState();
  useEffect(() => {
    MygroupsParticep(setGroupDiscover);
  }, []);
  

  return (
    <div className={`${styles.menuMiddle} ${styles.YourGroups}`}>
      <div className={styles.contentListYourGroups}>
        {groupDiscover && groupDiscover.map((item, index) => (
          <BuilElementGroup key={index} image={item.avatarpath} gName={item.title} groudId={item.id} />
        ))}
      </div>
    </div>
  );
}

export function BuilElementGroup({ image, gName, groudId }) {
  return (
    <div className={styles.elementGroup}>
      <div className={styles.topElement}>
        <Link href={`./profilegroup/?id=${groudId}`}>
            <img src={image?`data:image/png;base64,${image}`:defaultImage} alt="" />
            <span>{gName}</span>
        </Link>

      </div>
      <Link href={`./profilegroup/?id=${groudId}`} className={styles.view}>
        View group
      </Link>
     
    </div>
  );
}
