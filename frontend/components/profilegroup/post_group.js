import { useState, useRef } from "react";
import styles from '../../styles/modules/CreatePost.module.css'
import EmojiForm from "../emoji/emoji";

export default function PostGroup({ PostForm }) {

  const [emoji, setEmoji] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const fileInputRef = useRef(null);

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const toggleEmojicon = () => setEmoji(!emoji);

  return (
    <div className={`${styles.contentFormPost} content-form-post`}>
      <div className={styles.postHeader}>
        <h1>Create post</h1>
        <i className="fa-regular fa-circle-xmark close-form-btn" onClick={PostForm} title="Close form"></i>
      </div>
      <hr />
      <form action="">
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