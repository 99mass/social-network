import Link from "next/link";
import { getPostsUser } from "../../handler/getPostsUser";
import { useEffect, useState } from "react";
import { getElapsedTime } from "../../utils/convert_dates";
import { truncateText } from "../../utils/helper";
import { DeleteAskForFriends, askForFriends } from "../../handler/follower";
import { likeDislikePost } from "../../handler/likeDislikePost";

export default function MidlleBloc() {

  const [posts, setPosts] = useState(null);

  useEffect(() => {
    getPostsUser(setPosts);
  }, []);

  return (
    <div className="menu-middle">
      {posts && posts.map((item) => (
        <div className="post" key={item.post.id}>
          <PostHeader
            iduser={item.user.id}
            user={item.user.firstname}
            image={item.user.avatarpath}
            isfollowed={item.is_followed}
            time={`${getElapsedTime(item.post.created_at).value} ${getElapsedTime(item.post.created_at).unit}`}
            setPosts={setPosts}
          />
          <PostMiddle
            content={item.post.content}
            image={item.post.image_path}
          />
          <PostFooter
            numberLike={item.nbr_likes}
            numberComment={item.nbr_comments}
            userid={item.user.id}
            postid={item.post.id}
            setPosts={setPosts}
          />
        </div>
      ))
      }
    </div>
  );
}

export function PostHeader({ iduser, user, image, isfollowed, time, setPosts }) {
  const handlerFollower = (stateFollow) => {
    if (stateFollow !== "Follow") {
      DeleteAskForFriends(iduser, setPosts);
    } else {
      askForFriends(iduser, setPosts);
    }
  };

  return (
    <div className="profileuser">
      <div className="left-side">
        <div className="profile-pic">
          <Link href={`./profileuser?userid=${iduser}`}>
            <img src={image && image !== "" ? `data:image/png;base64,${image}` : "../images/user-circle.png"} alt="" />
          </Link>
        </div>
        <span>
          <h3>
            {user} .
            <span onClick={() => handlerFollower(isfollowed)} className="follow" title="follow">
              {isfollowed}
            </span>
          </h3>
          <p>
            {time} <sup>.</sup> <i className="fas fa-globe-africa"></i>
          </p>
        </span>
      </div>
    </div>
  );
}

export function PostMiddle({ content, image }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        className={`post-content-text ${expanded ? "expanded" : ""}`}
        onClick={toggleExpand}
      >
        <pre> {expanded ? content : truncateText(content)}</pre>
      </div>

      <div className="post-content">
        {image && <img src={`data:image/png;base64,${image}`} alt="" />}
      </div>
    </>
  );
}

export function PostFooter({ numberLike, numberComment, userid, postid, setPosts }) {

  const handlerLikeDislikePost = () => {
    const data = {
      user_id: userid,
      post_id: postid
    }
    likeDislikePost(data, setPosts);
  }

  return (
    <div className="liked">
      <div onClick={handlerLikeDislikePost} className={`liked-icon ${true && 'liked-yes'}`}>
        {true ? <i className="far fa-thumbs-up"></i> : <i className="fa-solid fa-thumbs-up liked-yes"></i>}
        <span className={`${false && 'liked-yes'}`}>{numberLike}</span>
      </div>
      <Link href={`./comment?postid=${postid}`}>
        <div className="liked-icon">
          <i className="far fa-comment"></i> <span>{numberComment}</span>
        </div>
      </Link>
    </div>
  );
}
