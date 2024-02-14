import Link from "next/link";
import { getPostsUser } from "../../handler/getPostsUser";
import { useEffect, useState } from "react";
import { getElapsedTime } from "../../utils/convert_dates";
import { truncateText } from "../../utils/helper";
import { askForFriends } from "../../handler/follower";

export default function MidlleBloc() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    getPostsUser(setPosts);
  }, []);

  console.log(posts && posts);

  return (
    <div className="menu-middle">
      {posts && posts.map((item) => (
                <div className="post" key={item.Post.id}>
                    <PostHeader
                        iduser={item.Post.user_id}
                        user={item.User.firstname}
                        image={item.Post.image_path}
                        time={`${getElapsedTime(item.Post.created_at).value} ${getElapsedTime(item.Post.created_at).unit}`}
                    />
                    <PostMiddle
                        content={item.Post.content}
                        image={item.Post.image_path}
                    />
                    <PostFooter
                        numberLike={"15k"}
                        numberComment={"6k"}
                        postid={item.Post.id}
                    />
                </div>
            ))
            }
    </div>
  );
}

export function PostHeader({ iduser, user, image, time }) {
  const handlerFollower = () => {
    askForFriends(iduser);
  };

  return (
    <div className="profileuser">
      <div className="left-side">
        <div className="profile-pic">
          <Link href={`./profileuser?userid=${iduser}`}>
            {image && <img src={`data:image/png;base64,${image}`} alt="" />}
            {!image && <img src={"../images/default-image.svg"} alt="" />}
          </Link>
        </div>
        <span>
          <h3>
            {user} .
            <span onClick={handlerFollower} className="follow" title="follow">
              Follow
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
        {image && <img src={`data:image/png;base64,${image}`} alt=""/>}      
      </div>
    </>
  );
}

export function PostFooter({ numberLike, numberComment, postid }) {
  return (
    <div className="liked">
      <div className="liked-icon">
        <i className="far fa-thumbs-up"></i> <span>{numberLike}</span>
      </div>
      <Link href={`./comment?postid=${postid}`}>
        <div className="liked-icon">
          <i className="far fa-comment"></i> <span>{numberComment}</span>
        </div>
      </Link>
    </div>
  );
}
