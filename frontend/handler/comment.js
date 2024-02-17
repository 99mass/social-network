import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";
import { getSpecificPostsUser } from "./getPostsUser";

export const AddComment = async (data,postid,setComment,setPostData) => {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.addcomment, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      getCommentPost(setComment, postid);
      getSpecificPostsUser(postid, setPostData);
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};

export const getCommentPost = async (setComment, post_id) => {
  if (post_id) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.show_comments_post + `?post_id=${post_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        console.error("Failed to fetch coment data");
      } else {
        const data = await response.json();
        setComment(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};