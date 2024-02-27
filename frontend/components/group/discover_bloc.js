import { useEffect, useState } from "react";
import { Groupstodiscover } from "../../handler/getGroup";
import styles from "../../styles/modules/group.module.css";
import { defaultImage } from "./group_page";
import Link from "next/link";
import { JoingGroupRequestHandler } from "../../handler/jointGroup";

export default function DiscoverBloc() {
  const [groupDiscover, setGroupDiscover] = useState();
  useEffect(() => {
    Groupstodiscover(setGroupDiscover);
  }, []);

  const joinGroup = (groudId) => {
    JoingGroupRequestHandler(groudId, null, setGroupDiscover);
  }


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
              nMembres={item.nbr_members}
              groudId={item.id}
              joinGroup={joinGroup}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GoupFace({ image, gName, nMembres, groudId, joinGroup }) {

  return (
    <div className={styles.postSugess}>
      <Link href={`./profilegroup/?id=${groudId}`}>
        <img src={image ? `data:image/png;base64,${image}` : defaultImage} alt="" />
      </Link>
      <div>
        <div className={styles.nameGroupMembres}>
          <Link href={`./profilegroup/?id=${groudId}`}>
            <span>{gName}</span>
            <span>{nMembres} members</span>
          </Link>
        </div>
        <div className={styles.btns}>
          <button onClick={() => joinGroup(groudId)} >join group</button>
        </div>
      </div>
    </div>
  );
}
