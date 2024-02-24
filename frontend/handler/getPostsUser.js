import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getPostsUser = async (setPosts) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.ShowPosts, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to fetch PostsUser data");
    } else {
      const data = await response.json();
      setPosts(data);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const getSpecificPostsUser = async (post_id, setPostData) => {
  if (post_id) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(`${api.ShowPosts}?post_id=${post_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        console.error("Failed to fetch SpecificPostsUser data");
      } else {
        const data = await response.json();
        setPostData(data);
      }
    } catch (error) {
      console.error("Error fetching SpecificPostsUser data:", error.message);
    }
  }
};

export const getPostsUserCreated = async (
  userid,
  setPostsCreated
) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(`${api.UserPosts}?user_id=${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch PostsUserCreated  data");       
      } else {
        const data = await response.json();
        setPostsCreated(data);
      }
    } catch (error) {
      console.error("Error fetching PostsUserCreated data:", error.message);     
    }
  }
};
