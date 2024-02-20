import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getGroupFollow = async (
    userid,
    setGroupFollow
  ) => {
    if (userid) {
      try {
        const sessionId = getSessionCookie();
  
        const response = await fetch(`${api.userPosts}?user_id=${userid}`, {
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
          setGroupFollow(data);
        }
      } catch (error) {
        console.error("Error fetching PostsUserCreated data:", error.message);     
      }
    }
  };