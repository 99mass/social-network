import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/group.module.css";
import {
  AcceptGroupInvitation,
  DeclineGroupInvitation,
  ShowGroupInvitation,
} from "../../handler/groupAction";

export default function RequestGroup() {
  const [requeLists, setRequestLists] = useState(null);

  useEffect(() => {
    ShowGroupInvitation(setRequestLists);
  }, []);

  const handlerAcceptInvitationGroup = (group_id) => {
    AcceptGroupInvitation(group_id, setRequestLists);
  };
  const handlerDeclineInvitaionGroup = (group_id) => {
    DeclineGroupInvitation(group_id, setRequestLists);
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
                handlerAcceptInvitationGroup={handlerAcceptInvitationGroup}
                handlerDeclineInvitaionGroup={handlerDeclineInvitaionGroup}
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
  handlerAcceptInvitationGroup,
  handlerDeclineInvitaionGroup,
}) {
  return (
    <div className={styles.postSugess}>
      <Link href={`./profilegroup?id=${group_id}`}>
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
          <Link href={`./profilegroup?id=${group_id}`}>
            <span>{gName}</span>
            <span>{nMembres} membres</span>
          </Link>
        </div>
        <div className={styles.btns}>
          <button onClick={() => handlerAcceptInvitationGroup(group_id)}>
            join group
          </button>
          <button
            className={styles.declineBtn}
            onClick={() => handlerDeclineInvitaionGroup(group_id)}
          >
            decline group
          </button>
        </div>
      </div>
    </div>
  );
}
