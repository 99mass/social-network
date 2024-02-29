import Link from "next/link";
import { getPostsUser } from "../../handler/getPostsUser";
import { useEffect, useState } from "react";
import { getElapsedTime } from "../../utils/convert_dates";
import { truncateText } from "../../utils/helper";
import { askForFriends, UnfollowUser } from "../../handler/follower";
import { likeDislikePost } from "../../handler/likeDislikePost";

export default function MidlleBloc({ posts, setPosts }) {
  useEffect(() => {
    getPostsUser(setPosts);
  }, []);
  console.log(posts, "les");
  return (
    <div className="menu-middle">
      {posts ? (
        posts.map((item) => (
          <div className="post" key={item.post.id}>
            <PostHeader
              iduser={item.user.id}
              user={item.user.firstname}
              image={item.user.avatarpath}
              isfollowed={item.is_followed}
              time={`${getElapsedTime(item.post.created_at).value} ${
                getElapsedTime(item.post.created_at).unit
              }`}
              setPosts={setPosts}
              groupid={item.group_id}
              setPostsGroup={setPosts}
              groupName={item.group_name}
              groupId={item.group_id}
              groupAvatarPath={item.group_avatar_path}
            />
            <PostMiddle
              content={item.post.content}
              image={item.post.image_path}
            />
            <PostFooter
              is_liked={item.is_liked}
              numberLike={item.nbr_likes}
              numberComment={item.nbr_comments}
              userid={item.user.id}
              postid={item.post.id}
              setPosts={setPosts}
            />
          </div>
        ))
      ) : (
        <div className="noResults">
          <img src="../images/no-result.png" alt="no result found" />
          <p>
            there are no publications yet be the first to create a publication
          </p>
        </div>
      )}
    </div>
  );
}

export function PostHeader({
  iduser,
  user,
  image,
  isfollowed,
  time,
  setPosts,
  groupid,
  setPostsGroup,
  groupName,
  groupId,
  groupAvatarPath,
}) {
  const handlerFollower = (stateFollow) => {
    if (stateFollow == "Follow") {
      askForFriends(iduser, setPosts, null, groupid, setPostsGroup);
    } else if (stateFollow == "Unfollow" || stateFollow == "Delete") {
      UnfollowUser(iduser, setPosts, null, null, groupid, setPostsGroup);
    }
  };

  return (
    <div className="profileuser">
      <div className="left-side">
        <div
          className={`profile-pic ${
            groupName ? "profile-pic-group" : "profile-pic-simple"
          }`}
        >
          <Link
            href={
              !groupName
                ? `./profileuser?userid=${iduser}`
                : `./profilegroup?id=${groupId}`
            }
          >
            <img
              src={
                (image && image !== "") ||
                (groupAvatarPath && groupAvatarPath !== "")
                  ? !groupName
                    ? image !="" && 
                    `data:image/png;base64,${image}` 
                    : groupAvatarPath !== ""
                    ? `data:image/png;base64,${groupAvatarPath}`
                    : "../images/groups-defaul.png"
                  : "../images/user-circle.png"
              }
              alt=""
            />
          </Link>
          {groupName && (
            <Link href={`./profileuser?userid=${iduser}`}>
              <img
                src={
                  groupName && groupName !== ""
                    ? `data:image/png;base64,${image}`
                    : "../images/user-circle.png"
                }
                alt=""
              />
            </Link>
          )}
        </div>
        <span className={groupName ? `span-group` : `span-simple`}>
          {groupName && <h3>{groupName}</h3>}
          <h3>
            {user} .
            <span
              onClick={() => handlerFollower(isfollowed)}
              className={`${isfollowed}`}
              title="follow"
            >
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

export function PostFooter({
  is_liked,
  numberLike,
  numberComment,
  userid,
  postid,
  setPosts,
  setPostsCreated,
  groupid,
  setPostsGroup,
}) {
  const handlerLikeDislikePost = (is_liked) => {
    likeDislikePost(
      userid,
      postid,
      is_liked,
      setPosts,
      setPostsCreated,
      null,
      groupid,
      setPostsGroup
    );
  };
  return (
    <div className="liked">
      <div
        onClick={() => handlerLikeDislikePost(is_liked)}
        className={`liked-icon ${is_liked && "liked-yes"}`}
      >
        {is_liked ? (
          <i className="fa-solid fa-thumbs-up liked-yes"></i>
        ) : (
          <i className="far fa-thumbs-up"></i>
        )}
        <span className={`${is_liked && "liked-yes"}`}>{numberLike}</span>
      </div>
      <Link href={`./comment?postid=${postid}`}>
        <div className="liked-icon">
          <i className="far fa-comment"></i> <span>{numberComment}</span>
        </div>
      </Link>
    </div>
  );
}
