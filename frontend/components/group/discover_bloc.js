import { useEffect, useState } from "react";
import { Groupstodiscover } from "../../handler/getGroup";
import styles from "../../styles/modules/group.module.css";
import { defaultImage } from "./group_page";

export default function DiscoverBloc() {

  const [groupDiscover, setGroupDiscover] = useState();
  useEffect(() => {
    Groupstodiscover(setGroupDiscover);
    console.log("setGroupDiscover",groupDiscover);
  }, []);
console.log("groupDiscover: " , groupDiscover);
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GoupFace({ image, gName, nMembres }) {
  // const defaultImage = "../images/groups-defaul.png"; 
  

  return (
    <div className={styles.postSugess}>
      <a href="./profilegroup">
        <img src={image?`data:image/png;base64,${image}`:defaultImage} alt="" />
      </a>
      <div>
        <div className={styles.nameGroupMembres}>
          <a href="./profilegroup">
            <span>{gName}</span>
            <span>{nMembres}</span>
          </a>
        </div>
        <button type="submit">join group</button>
      </div>
    </div>
  );
}
