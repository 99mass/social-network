import { useEffect, useState } from "react";
import { Groupstodiscover } from "../../handler/getGroup";
import styles from "../../styles/modules/group.module.css";
import { defaultImage } from "./group_page";
import Link from "next/link";

export default function DiscoverBloc() {

  const [groupDiscover, setGroupDiscover] = useState();
  useEffect(() => {
    Groupstodiscover(setGroupDiscover);
   
  }, []);

  return (
    <div className={`${styles.menuMiddle} ${styles.discover}`}>
      <div className={styles.contentDicover}>
        <h3>Suggested for you</h3>
        <div className={styles.listPostSugession}>
          {groupDiscover && groupDiscover.map((item, index) => (
            <GoupFace
              key={index}
              image={item.avatarpath}
              gName={item.title}
              nMembres={item.nMembres}
              groudId={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GoupFace({ image, gName, nMembres, groudId }) {
 
  return (
    <div className={styles.postSugess}>
      <Link href={`./profilegroup/?id=${groudId}`}>
            <img src={image?`data:image/png;base64,${image}`:defaultImage} alt="" />
      </Link>
      <div>
        <div className={styles.nameGroupMembres}>
        <Link href={`./profilegroup/?id=${groudId}`}>
             <span>{gName}</span>
            <span>{nMembres} memebers</span>
        </Link>
        </div>
        <button type="submit">join group</button>
      </div>
    </div>
  );
}
