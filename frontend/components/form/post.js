import { useState, useRef } from "react";
import styles from "../../styles/modules/CreatePost.module.css";
import EmojiForm from "../emoji/emoji";
import { errorNotification } from "../../utils/sweeAlert";
import { AddPostUser } from "../../handler/sendPostUser";
import { EncodeImage } from "../../utils/encodeImage";
import { getFriendsLists } from "../../handler/follower";
import { getUserBySession } from "../../handler/getUserBySession";

export default function Post({ togglePostForm, setPostForm, setPosts }) {
  const [emoji, setEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [imgeName, setImageName] = useState("");
  const fileInputRef = useRef(null);
  
  const toggleImageName = () => {
    const _file = fileInputRef.current.files[0];
    if (_file) setImageName(_file.name);
  };

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const toggleEmojicon = () => setEmoji(!emoji);

  const handlerFromPost = (e) => {
    e.preventDefault();
    const dataFrom = new FormData(e.target);

    const content = dataFrom.get("Content");
    if (content.trim() == "") {
      errorNotification("Content can not be empty.");
      return;
    }
    const radioName = "Privacy";
    const radios = document.querySelectorAll(
      `input[name="${radioName}"]:checked`
    );
    let radioSelected;
    if (radios.length > 0) {
      radioSelected = radios[0].id;
    } else {
      errorNotification("Please choose a privacy.");
      return;
    }

    const checkedValues = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);

    // si on n'a pas d'image
    if (!fileInputRef.current.files[0]) {
      const data = {
        GroupID: "",
        Content: content,
        image_path: "",
        Privacy: radioSelected,
        Authorize_User: checkedValues,
      };
      console.log(data);
      AddPostUser(data, setPostForm, setPosts);
      return;
    }

    // si on a une image
    async function someFunction() {
      try {
        const encodedFile = await EncodeImage(fileInputRef);

        const data = {
          GroupID: "",
          Content: content,
          image_path: encodedFile,
          Privacy: radioSelected,
          Authorize_User: checkedValues,
        };
        AddPostUser(data, setPostForm, setPosts);
      } catch (error) {
        errorNotification(error);
      }
    }
    someFunction();
  };

  return (
    <div className={`${styles.contentFormPost} content-form-post`}>
      <div className={styles.postHeader}>
        <h1>create post</h1>
        <i
          className="fa-regular fa-circle-xmark close-form-btn"
          onClick={togglePostForm}
          title="Close form"
        ></i>
      </div>

      <hr />
      <form
        method="post"
        onSubmit={handlerFromPost}
        encType="multipart/form-data"
      >
        <PrivacyBloc />
        <div className={styles.postContent}>
          <textarea
            value={selectedEmoji}
            name="Content"
            onChange={(e) => setSelectedEmoji(e.target.value)}
            placeholder="What's on your mind ?"
          />
          <div className={styles.contentAssets}>
            <span>{imgeName}</span>
            <i
              className="fa-regular fa-file-image"
              title="Choose image"
              onClick={handleFileIconClick}
            >
              <input
                onChange={toggleImageName}
                type="file"
                className={styles.filesPost}
                ref={fileInputRef}
              />
            </i>
            <span
              onClick={toggleEmojicon}
              className="emoji"
              title="Choose emoji"
            >
              😄
            </span>
            {/* emoji form */}
            {emoji && (
              <EmojiForm
                toggleEmojicon={toggleEmojicon}
                setSelectedEmoji={setSelectedEmoji}
              />
            )}
          </div>
        </div>
        <button type="submit" className={styles.btnPost}>
          Post
        </button>
      </form>
    </div>
  );
}

export function PrivacyBloc() {
  const [listFriend, setListFriend] = useState(false);
  const showListF = (state) => {
    setListFriend(state);
  };
  return (
    <div className={styles.blocPrivacyPost}>
      <p>
        Who can see your post?
        <br />
        <br />
        Your post will show up in Feed, on your profile.
        <br />
        <br />
        Your post will be send to your Specific friends, but you can change the
        audience of this specific post.
      </p>
      <div>
        <div>
          <i className="fa-solid fa-earth-europe"></i>
          <div className={styles.part1}>
            <h3>Public</h3>
            <div>Anyone on or off Social-network</div>
          </div>
        </div>
        <input
          id="public"
          name="Privacy"
          type="radio"
          onClick={() => showListF(false)}
        />
      </div>

      <div>
        <div>
          <i className="fa-solid fa-user-group"></i>
          <div className={styles.part1}>
            <h3>Private</h3>
            <div>Your friends on Social-network</div>
          </div>
        </div>
        <input
          id="private"
          name="Privacy"
          type="radio"
          onClick={() => showListF(false)}
        />
      </div>

      <div>
        <div>
          <i className="fa-solid fa-user"></i>
          <div className={styles.part1}>
            <h3>Specific friends</h3>
            <div>Only show to some friends</div>
          </div>
        </div>
        <input
          id="almost"
          name="Privacy"
          type="radio"
          onChange={() => showListF(true)}
        />
      </div>
      {listFriend && <ListFriend />}
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

  // console.log(FriendsList && FriendsList)

  return (
    <div className={styles.listFriend}>
      <h3>
        <span>select friends</span>
      </h3>
      {FriendsList &&
        FriendsList.map((item) => (
          <div className={styles.userBloc} key={item.id}>
            <div>
              {item.avatarpath !== "" && (
                <img src={`data:image/png;base64,${item.avatarpath}`} alt="" />
              )}
              {!item.avatarpath && (
                <img src={`../images/user-circle.png`} alt="" />
              )}

              <span>{item.firstname + " " + item.lastname}</span>
            </div>
            <input
              defaultValue={item.id}
              name={item.id}
              type="checkbox"
              id=""
            />
          </div>
        ))}
    </div>
  );
}
