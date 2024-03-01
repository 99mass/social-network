import { PostFooter, PostHeader, PostMiddle } from "../home/middle_bloc";
import styles from "../../styles/modules/group.module.css";
import { getAllGroupPosts } from "../../handler/getPostsGroup";
import { useEffect, useState } from "react";
import { getElapsedTime } from "../../utils/convert_dates";
import { Loader } from "../../utils/spinner";

export function FeedBloc() {

  const [isLoading, setIsLoading] = useState(true)
  const [postGroups, setAllPostGroup] = useState(null);
  useEffect(() => {
    getAllGroupPosts(setAllPostGroup).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={`${styles.menuMiddle} _middle`}>
      {isLoading ? <Loader /> : <div className={`${styles.contenPosts} _contenPosts`}>
        {postGroups ? (
          postGroups.map((item, index) => (
            <div key={index} className={`${styles.contenPost} _contenPost`}>
              <PostsFeed item={item} setAllPostGroup={setAllPostGroup} />
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

      </div>}
    </div>
  );
}

export function PostsFeed({ item, setAllPostGroup }) {
  return (
    <div className="post">
      <PostHeader
        iduser={item.user.id}
        user={item.user.firstname}
        image={item.user.avatarpath}
        isfollowed={item.is_followed}
        time={`${getElapsedTime(item.post.created_at).value} ${getElapsedTime(item.post.created_at).unit
          }`}
        groupid={item.group_id}
        setAllPostGroup={setAllPostGroup}
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
        setAllPostGroup={setAllPostGroup}
      />
    </div>
  );
}
