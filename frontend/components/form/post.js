import { useState,useRef } from "react";
import styles from '../../styles/modules/CreatePost.module.css'

export default function Post({ PostForm }) {

      // lier mon icon plu avec mon input de type file 
      const fileInputRef = useRef(null);
      const handleFileIconClick = () => {
          fileInputRef.current.click();
      };

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
          <div className={styles.contentAssets}>
            <i className="fa-regular fa-file-image" title="Choose image" onClick={handleFileIconClick}><input type="file"  className={styles.filesPost} ref={fileInputRef} />
              </i><span className="emoji" title="Choose emoji">😄</span>
              </div>
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
      image: "https://media.istockphoto.com/id/1385118964/fr/photo/photo-dune-jeune-femme-utilisant-une-tablette-num%C3%A9rique-alors-quelle-travaillait-dans-un.webp?b=1&s=170667a&w=0&k=20&c=sIJx9U2Smx7siiAS4ZkJ0bzAsjeBdk4vvKsuW2xNrPY="
    },
    {
      name: "michel doe",
      image: "https://media.istockphoto.com/id/1413765605/fr/photo/portrait-dune-femme-daffaires-afro-am%C3%A9ricaine-prosp%C3%A8re.webp?b=1&s=170667a&w=0&k=20&c=T8Aiogu4Y9EnlE3sNKP_L6H5sHrYv4ttFMfzNgcUmwI="
    },
    {
      name: "jack doe",
      image: "https://media.istockphoto.com/id/1369508766/fr/photo/belle-femme-latine-%C3%A0-succ%C3%A8s-souriante.webp?b=1&s=170667a&w=0&k=20&c=hYzjJHP1DkGQIbtSjqwB87c2hplYO1Mn9cgheKr0M7o="
    },
    {
      name: "christin doe",
      image: "https://media.istockphoto.com/id/1511315040/fr/photo/souriez-tablette-et-recherchez-avec-une-femme-noire-au-bureau-pour-la-technologie.webp?b=1&s=170667a&w=0&k=20&c=D9yNSpTwRSf2Iw2xeOxFKnSxqD2xijYXsU4B6vxt-ys="
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