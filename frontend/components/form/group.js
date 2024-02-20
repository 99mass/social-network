import { getFriendsLists } from '../../handler/follower';
import { getUserBySession } from '../../handler/getUserBySession';
import styles from '../../styles/modules/CreateGroup.module.css'
import { useState} from "react";
import { errorNotification } from "../../utils/sweeAlert";
import { AddGroup } from '../../handler/sendGroup';


export default function Group({ GroupForm }) {

  const handlerFromGroup = (e) => {
    e.preventDefault();
    const dataFrom = new FormData(e.target);
  
    const title = dataFrom.get("Title");
   
    if (title.trim() == "") {
      errorNotification("Title can not be empty.");
      return;
    }

    const description = dataFrom.get("Description");
   
    if (description.trim() == "") {
      errorNotification("Description can not be empty.");
      return;
    }

    const checkedValues = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);
   

    const data = {
      title:title,
      description: description,
      addedUsersToGroup: checkedValues,
    };

    AddGroup(data)  
  };


  return (
    <div className={styles.contentFormGroup}>
      <div className={styles.groupHeader}>
        <h1>Create group</h1>
        <i className="fa-regular fa-circle-xmark close-form-group-btn" onClick={GroupForm} title="Close form"></i>
      </div>
      <hr />
      <form 
        method="post"
        onSubmit={handlerFromGroup}
        encType="multipart/form-data"
      >
        <div className={styles.groupContent}>
          <input type="text" className={styles.titleGroup} name='Title' placeholder="Title of the group" />
          <textarea name="Description" placeholder="Decription of the group" id="" ></textarea>
        </div>
        <ListFriend />
        <button className={styles.btnGroup}>Create</button>

      </form>
    </div>
  );
}




export function ListFriend() {
      const [datasUser, setDatasUser] = useState(null);

      const [FriendsList, setFriendsList] = useState(null);

      if (datasUser == null) {
        getUserBySession(setDatasUser);
      }

      let userId = datasUser && datasUser.id;

      if (FriendsList === null && userId !== null) {
        getFriendsLists(userId, setFriendsList);
      }


      return (
        <div className={styles.listFriend}>
          <h3>
            <span>select friends</span>
          </h3>
          {FriendsList && FriendsList.map((item) => (
            <div className={styles.userBloc} key={item.id}>
              <div>
                {item.avatarpath !== '' && <img src={`data:image/png;base64,${item.avatarpath}`} alt="" />}
                {!item.avatarpath && <img src={`../images/user-circle.png`} alt="" />}

                <span>{item.firstname + ' ' + item.lastname}</span>
              </div>
              <input defaultValue={item.id} name={item.id} type="checkbox" id="" />
            </div>
          ))}
        </div>
      );
}