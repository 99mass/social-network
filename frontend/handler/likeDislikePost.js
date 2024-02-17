import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { getPostsUser, getPostsUserCreated } from "./getPostsUser";

export const likeDislikePost = async (userid,postid,is_liked, setPosts,setPostsCreated) => {
   
    const data = {
        post_id: postid,
        action: is_liked ? "dislike" : "like",
      }
    try {
        const sessionId = getSessionCookie();

        const response = await fetch(api.likeDslikepost, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: sessionId,
            },
            body: JSON.stringify(data),
        });

        // Vérifier le statut de la réponse
        if (response.ok) {
          if(setPosts)  getPostsUser(setPosts);
          if(setPostsCreated)  getPostsUserCreated(userid, setPostsCreated);
        }

    } catch (error) {
        console.error("Error fetching profile data:", error.message);
    }
};