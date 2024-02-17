import { PostFooter, PostHeader, PostMiddle } from "../home/middle_bloc"
import styles from '../../styles/modules/profile.module.css'
import { getElapsedTime } from "../../utils/convert_dates";

export default function Posts_user({ postsCreated,setPostsCreated, about }) {

    console.log(postsCreated && postsCreated);
    return (
        <div className={styles.body1}>
            <div className={styles.bodymenu}>
                {postsCreated && postsCreated.map((item) => (
                    <div className="post" key={item.post.id}>
                        <PostHeader
                        iduser={item.user.id}
                            user={item.user.firstname}
                            image={item.user.avatarpath}
                            time={`${getElapsedTime(item.post.created_at).value} ${getElapsedTime(item.post.created_at).unit}`}
                        />
                        <PostMiddle content={item.post.content} image={item.post.image_path} />
                        <PostFooter numberLike={item.nbr_likes} numberComment={item.nbr_comments} userid={item.user.id} postid={item.post.id} setPostsCreated={setPostsCreated}/>
                    </div>
                ))
                }
            </div>
            {about && <div className={styles.bio}> {about} </div>}
            {about && <div className={styles.notBio}> </div>}
        </div>
    )
}