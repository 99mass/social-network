import {
  CommentPost,
  FormComment,
  PostFooterComment,
} from "../comment/comment_bloc";
import { PostHeader, PostMiddle } from "../home/middle_bloc";
import styles from "../../styles/modules/group.module.css";
import { getAllGroupPosts } from "../../handler/getPostsGroup";
import { useEffect, useState } from "react";
import { getElapsedTime } from "../../utils/convert_dates";


export function FeedBloc() {


  const [postGroups, setPostGroups] = useState(null);
  useEffect(() => {
    getAllGroupPosts(setPostGroups);
  }, []);

  console.log(postGroups, "mes posts du group")
  
  const dataComment = [
    {
      user: "alpha",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "3mn",
    },
    {
      user: "breukh",
      textComment:
        "Lorem ipsum dolor sit amet elit dolor sit amet elit. Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "2mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
    {
      user: "tom",
      textComment: "Lorem ipsum dolor sit amet elit dolor sit amet elit.",
      commentUserUrl:
        "",
      time: "1mn",
    },
  ];

  return (
    <div className={`${styles.menuMiddle} _middle`}>
      <div className={`${styles.contenPosts} _contenPosts`}>
      {postGroups ? (
        postGroups.map((item, index) => (
            <div key={index} className={`${styles.contenPost} _contenPost`}>
              <PostsFeed item={item} dataComment={dataComment} setPostGroups={setPostGroups}/>
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
    </div>
  );
}

export function PostsFeed({ item, dataComment, setPostGroups }) {
  return (
    <div className="post">
       <PostHeader
              iduser={item.user.id}
              user={item.user.firstname}
              image={item.user.avatarpath}
              isfollowed={item.is_followed}
              time={`${getElapsedTime(item.post.created_at).value} ${
                getElapsedTime(item.post.created_at).unit
              }`}
              setPosts=""
              groupid={item.group_id}
              setPostsGroup={setPostGroups}
              groupName={item.group_name}
              groupId={item.group_id}
              groupAvatarPath={item.group_avatar_path}
        />
        <PostMiddle
              content={item.post.content}
              image={item.post.image_path}
        />
        <PostFooterComment 
              userid={item.user.id} 
              postid={item.post.id} 
              is_liked={item.is_liked} 
              numberLike={item.nbr_likes} 
              numberComment={item.nbr_comments} 
              setPostData="" />
        <CommentPost data={null} />
      <FormComment postid={item.post.id} setComment={null} />
    </div>
  );
}
