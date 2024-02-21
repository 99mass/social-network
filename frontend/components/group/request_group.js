import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/group.module.css";
import {
  AcceptGroupInvitation,
  ShowGroupInvitation,
} from "../../handler/groupAction";

export default function RequestGroup() {
  const [requeLists, setRequestLists] = useState(null);

  useEffect(() => {
    ShowGroupInvitation(setRequestLists);
  }, []);

  const handlerAcceptatinGroup = (group_id) => {
    console.log(group_id);
    AcceptGroupInvitation(group_id, setRequestLists);
  };

  return (
    <div className={`${styles.menuMiddle} ${styles.discover}`}>
      <div className={styles.contentDicover}>
        <h3>Request groups List</h3>
        <div className={styles.listPostSugession}>
          {requeLists ? (
            requeLists.map((item, index) => (
              <GoupName
                key={`${item.id}${index}`}
                group_id={item.id}
                image={item.avatarpath}
                gName={item.title}
                nMembres={item.nbr_members}
                handlerAcceptatinGroup={handlerAcceptatinGroup}
              />
              
            ))
          ) : (
            <div className={styles.noResults}>
              <img src="../images/no-result.png" alt="no result found" />
              <p>no request found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function GoupName({
  group_id,
  image,
  gName,
  nMembres,
  handlerAcceptatinGroup,
}) {
  return (
    <div className={styles.postSugess}>
      <Link href={`./profilegroup?groupid=${group_id}`}>
        <img
          src={
            image
              ? `data:image/png;base64,${image}`
              : "../images/groups-defaul.png"
          }
          alt=""
        />
      </Link>
      <div>
        <div className={styles.nameGroupMembres}>
          <Link href={`./profilegroup?groupid=${group_id}`}>
            <span>{gName}</span>
            <span>{nMembres} membres</span>
          </Link>
        </div>
        <button onClick={() => handlerAcceptatinGroup(group_id)}>
          join group
        </button>
        <button className={styles.declineBtn} onClick={() => handlerAcceptatinGroup(group_id)}>
          decline group
        </button>
      </div>
    </div>
  );
}
