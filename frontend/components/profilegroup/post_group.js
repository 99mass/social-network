import { useState, useRef } from "react";
import styles from '../../styles/modules/CreatePost.module.css'
import EmojiForm from "../emoji/emoji";
import { AddPostGroup } from "../../handler/groupAction";
import { errorNotification } from "../../utils/sweeAlert";
import { EncodeImage } from "../../utils/encodeImage";


export default function PostGroup({ PostForm,setPostsGroup,groupId }) {

  const [emoji, setEmoji] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const fileInputRef = useRef(null);

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const toggleEmojicon = () => setEmoji(!emoji);

  const handlerGroupFromPost = (e) => {
    e.preventDefault();
    const dataFrom = new FormData(e.target);

    const content = dataFrom.get("content");
    if (content.trim() == "") {
      errorNotification("Content can not be empty.");
      return;
    }
  
    // si on n'a pas d'image
    if (!fileInputRef.current.files[0]) {
      const data = {
        group_id: groupId,
        content: content,
        image_path: "",
        
      };
     
      AddPostGroup(data,setPostsGroup,groupId)
      return;
    }
   
     // si on a une image
     async function someFunction() {
      try {
        const encodedFile = await EncodeImage(fileInputRef);

        const data = {
          group_id: groupId,
          content: content,
          image_path: encodedFile,
        };
        AddPostGroup(data,setPostsGroup,groupId);
      } catch (error) {
        errorNotification(error);
      }
    }
    someFunction();
  }
  
  return (
    <div className={`${styles.contentFormPost} content-form-post`}>
      <div className={styles.postHeader}>
        <h1>Create post</h1>
        <i className="fa-regular fa-circle-xmark close-form-btn" onClick={PostForm} title="Close form"></i>
      </div>
      <hr />
      <form 
        method="post"
        onSubmit={handlerGroupFromPost}
        encType="multipart/form-data"
      >
        <div className={styles.postContent}>
          <textarea
            value={selectedEmoji}
            name="content"
            onChange={(e) => setSelectedEmoji(e.target.value)}
            placeholder="What's on your mind ?" id="" />
          <div className={styles.contentAssets}>
            <i className="fa-regular fa-file-image" title="Choose image" onClick={handleFileIconClick}><input type="file" className={styles.filesPost} ref={fileInputRef} />
            </i><span onClick={toggleEmojicon} className="emoji" title="Choose emoji">😄</span>

            {emoji && <EmojiForm toggleEmojicon={toggleEmojicon} setSelectedEmoji={setSelectedEmoji} />}

          </div>
        </div>
        <button className={styles.btnPost}>Post</button>
      </form>
    </div>
  );
}