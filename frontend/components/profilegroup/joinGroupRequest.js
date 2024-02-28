import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/profile.module.css";
import { getJoinGroupRequest } from "../../handler/getJoinGroupRequest";
import {

  AcceptJoinGroupRequest, 
  DeclineJoinGroupRequest,
 

} from "../../handler/groupAction";




export default function JoinRequestGroup({groupId}) {
  
  const [joinRequestLists, setJoinRequestLists] = useState(null);

  useEffect(() => {

    getJoinGroupRequest( setJoinRequestLists, groupId)
    
  }, [groupId,  setJoinRequestLists ]);

 

  const handlerAcceptJoinGroupRequest = (userId, group_id) => {
    AcceptJoinGroupRequest(userId, group_id, setJoinRequestLists);
  };

  const handlerDeclineJoinGroupRequest = (userId, group_id) => {
    DeclineJoinGroupRequest( group_id, setJoinRequestLists, getJoinGroupRequest, userId);
  };
  

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
                        onClick={() => handlerAcceptJoinGroupRequest(user.user_id, groupId)}
                        className={styles.unfollowBtn}
                    >
                        <i className="fa-solid fa-check"></i>Accept
                    </span>
                    <span
                        onClick={() => handlerDeclineJoinGroupRequest(user.user_id, groupId)}
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
          <p>you have no join request</p>
        </div>
      )}
    </div>
  );  

}
