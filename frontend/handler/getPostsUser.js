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
      console.error("Failed to fetch profile data");
    }
    // Analyser la réponse JSON
    const data = await response.json();
    setPosts(data);
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const getPostsUserCreated = async (userid, setPostsCreated) => {
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

      // Vérifier le statut de la réponse
      if (!response.ok) {
        console.error("Failed to fetch profile data");
      }
      // Analyser la réponse JSON
      const data = await response.json();

      setPostsCreated(data);
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};
