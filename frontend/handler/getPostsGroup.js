import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getPostsGroup = async (groupid,setPostsGroup) => {
  try {
    const sessionId = getSessionCookie();
    console.log("groupid",groupid)
    const response = await fetch(api.GetPostsGroup+`?groupid=${groupid}`, {
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
      console.log("postgroup fetch:",data)
      setPostsGroup(data);
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
  setPostsGroupCreated
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
        setPostsGroupCreated(data);
      }
    } catch (error) {
      console.error("Error fetching PostsUserCreated data:", error.message);     
    }
  }
};
