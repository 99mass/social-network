import { useEffect, useState } from "react";
import { getPostsGroup } from "../../handler/getPostsGroup";
import { getElapsedTime } from "../../utils/convert_dates";
import styles from "../../styles/modules/profile-group.module.css";
import { PostFooter, PostHeader, PostMiddle } from "../home/middle_bloc";
import { useRouter } from "next/router";


export default function Discussion({ description }) {
  
  const router = useRouter();
  // const { groupid } = router.query;
  const [postData, setPostsGroup] = useState(null);
  // const [comment, setComment] = useState(null);
  let groupid = "546f7041-7185-41d6-8634-d5e97d3825c7"
  console.log("grosupid:", groupid);
  useEffect(() => {
    if (groupid) {
      getPostsGroup(groupid, setPostsGroup)
      console.log("postgroup data:",postData)
    }
  }, [])
  // iduser,
  // user,
  // image,
  // isfollowed,
  // time,
  // setPosts,
  
  return (
    <div className={styles.contentPostAbout}>
      <div className={styles.blocLeft}>
        {postData ? (postData.map((item, index) => (
          <div className="post" key={index}>
            <PostHeader
              iduser={item.user.id}
              user={item.user.firstname}
              image={item.post.image_path}
              isfollowed={item.is_followed}
              time={`${getElapsedTime(item.post.created_at).value} ${
                getElapsedTime(item.post.created_at).unit
              }`}
              setPosts={setPostsGroup}
              groupid={groupid}
            />
            <PostMiddle content={item.post.content} image={item.post.image_path} />
            <PostFooter />
          </div>
        ))) : null}
      </div>
      <AboutGroup description={description} />
    </div>
  );
}

export function AboutGroup({ description }) {

  return (
    <div className={styles.aboutBloc}>
      {description}

    </div>
  )
}
