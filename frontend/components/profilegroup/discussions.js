import { useEffect } from "react";
import { getPostsGroup } from "../../handler/getPostsGroup";
import { getElapsedTime } from "../../utils/convert_dates";
import styles from "../../styles/modules/profile-group.module.css";
import { PostFooter, PostHeader, PostMiddle } from "../home/middle_bloc";

export default function Discussion({
  postGroup,
  setPostsGroup,
  groupId,
  description,
  isMember
}) {
  useEffect(() => {
    if (groupId) {
      getPostsGroup(groupId, setPostsGroup);
    }
  }, [groupId]);

  return (
    <div className={styles.contentPostAbout}>
      <div className={styles.blocLeft}>
        {postGroup && isMember &&
          postGroup.map((item, index) => (
            <div className="post" key={index}>
              <PostHeader
                iduser={item.user.id}
                user={item.user.firstname}
                image={item.post.image_path}
                isfollowed={item.is_followed}
                time={`${getElapsedTime(item.post.created_at).value} ${
                  getElapsedTime(item.post.created_at).unit
                }`}
                groupid={groupId}
                setPostsGroup={setPostsGroup}
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
                groupid={groupId}
                setPostsGroup={setPostsGroup}
              />
            </div>
          ))}
      </div>
      <AboutGroup description={description} />
    </div>
  );
}

export function AboutGroup({ description }) {
  return <div className={styles.aboutBloc}>{description}</div>;
}
