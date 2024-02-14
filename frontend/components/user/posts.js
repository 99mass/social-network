import { PostFooter, PostHeader, PostMiddle } from "../home/middle_bloc"
import styles from '../../styles/modules/profile.module.css'
import { useEffect, useState } from "react";
import { getPostsUserCreated } from "../../handler/getPostsUser";
import { getElapsedTime } from "../../utils/convert_dates";

export default function Posts_user({postsCreated,about}) {

    return (
        <div className={styles.body1}>
            <div className={styles.bodymenu}>
                {postsCreated && postsCreated.map((item) => (
                    <div className="post" key={item.id}>
                        <PostHeader 
                        user={"breukh"} 
                        image={item.image_path} 
                        time={`${getElapsedTime(item.created_at).value} ${getElapsedTime(item.created_at).unit}`} 
                        />
                        <PostMiddle text={item.content} image={item.image_path} />
                        <PostFooter numberLike={"15k"} numberComment={"5k"}  />
                    </div>
                ))
                }
            </div>
           {about && <div className={styles.bio}> {about} </div>}
           {!about && <div className={styles.notBio}> </div>}
        </div>
    )
}