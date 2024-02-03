import { useState } from "react";
import styles from '../../styles/CreatePost.module.css'

export default function Post({ PostForm }) {

  return (
    <div className={`${styles.contentFormPost} content-form-post`}>
      <div className={styles.postHeader}>
        <h1>create post</h1>
        <i className="fa-regular fa-circle-xmark close-form-btn" onClick={PostForm} title="Close form"></i>
      </div>
      <hr />
      <form action="">
        <PrivacyBloc />
        <div className={styles.postContent}>
          <textarea name="" placeholder="What's on your mind, Breukh?" id="" ></textarea>
          <div className={styles.contentAssets}><i className="fa-regular fa-file-image" title="Choose image"></i><span className="emoji" title="Choose emoji">😄</span></div>
        </div>
        <button className={styles.btnPost}>Post</button>
      </form>
    </div>

  );
}

export function PrivacyBloc() {

  const [listFriend, setListFriend] = useState(false)
  const showListF = (state) => {
    setListFriend(state)
  }


  return (
    <div className={styles.blocPrivacyPost}>
      <p>Who can see your post?<br /><br />
        Your post will show up in Feed, on your profile.<br /><br />
        Your post will be send  to your Specific friends, but you can change the audience of this specific post.
      </p>
      <div>
        <div>
          <i className="fa-solid fa-earth-europe"></i>
          <div className={styles.part1}>
            <h3>Public</h3>
            <div>Anyone on or off Social-network</div>
          </div>
        </div>
        <input name="privacy" type="radio" onClick={() => showListF(false)} />
      </div>

      <div>
        <div>
          <i className="fa-solid fa-user-group"></i>
          <div className={styles.part1}>
            <h3>Private</h3>
            <div>Your friends on Social-network</div>
          </div>
        </div>
        <input name="privacy" type="radio" onClick={() => showListF(false)} />
      </div>

      <div>
        <div>
          <i className="fa-solid fa-user"></i>
          <div className={styles.part1}>
            <h3>Specific friends</h3>
            <div>Only show to some friends</div>
          </div>
        </div>
        <input name="privacy" type="radio" onChange={() => showListF(true)} />
      </div>
      {listFriend && <ListFriend />}

    </div>
  )
}

export function ListFriend() {
  const data = [
    {
      name: "alice doe",
      image: "person1.jpg"
    },
    {
      name: "michel doe",
      image: "person2.jpg"
    },
    {
      name: "jack doe",
      image: "person3.jpg"
    },
    {
      name: "christin doe",
      image: "person4.jpg"
    }
  ];
  return (
    <div className={styles.listFriend}>
      <h3> <span>select friends</span></h3>
      {data.map((item, index) => (

        <div className={styles.userBloc} key={index}>
          <div>
            <img src={"" + item.image} alt="" />
            <span>{item.name}</span>
          </div>
          <input type="checkbox" name="" id="" />
        </div>

      ))
      }
    </div>
  )
}