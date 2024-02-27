import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/profile.module.css";

import {
  AcceptGroupInvitation,
  DeclineGroupInvitation,

} from "../../handler/groupAction";
import { getJoinGroupRequest } from "../../handler/getJoinGroupRequest";

export default function JoinRequestGroup({groupId}) {
  
  const [joinRequestLists, setJoinRequestLists] = useState(null);

  useEffect(() => {
  
    getJoinGroupRequest(groupId, setJoinRequestLists)
    
  }, [groupId,  setJoinRequestLists ]);

  console.log(joinRequestLists, groupId,  "requests lists")

//   const handlerAcceptInvitationGroup = (group_id) => {
//     AcceptGroupInvitation(group_id, setRequestLists);
//   };
//   const handlerDeclineInvitaionGroup = (group_id) => {
//     DeclineGroupInvitation(group_id, setRequestLists);
//   };

  return (
    <div className={styles.contentListFriend}>
      {joinRequestLists? (
        joinRequestLists?.map((user, index) => (
          <div key={`${user.user_id}${index}`} className={styles.bloc}>
            <img
              src={
                user.image
                  ? `data:image/png;base64,${user.image}`
                  : "../images/user-circle.png"
              }
              alt=""
            />

            <div className={styles.conteUnfollow}>
              <h4>{`${user.first_name} ${user.last_name}`}</h4>
               
              <div className={styles.joinContainer}>
                    <span
                        // onClick={() => handlerFollower(user.follower_id)}
                        className={styles.unfollowBtn}
                    >
                        <i className="fa-solid fa-check"></i>Accept
                    </span>
                    <span
                        // onClick={() => handlerFollower(user.follower_id)}
                        className={styles.unfollowBtn}
                    >
                        <i className="fa-solid fa-rectangle-xmark"></i>Banner
                    </span>
              </div>
              
            </div>
          </div>
        ))
      ) : (
        <div className="noResults">
          <img src="../images/no-result.png" alt="no result found" />
          <p>you have nofollower </p>
        </div>
      )}
    </div>
  );  

}
