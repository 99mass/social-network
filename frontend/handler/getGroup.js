import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getGroupFollow = async (userid, setGroupFollow) => {
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
   
        setGroupFollow(data);
      }
    } catch (error) {
      console.error("Error fetching PostsUserCreated data:", error.message);
    }
  }
};

export async function getMygroups(userid, setDatas) {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Mygroups , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });
      console.log("Response status:", response.status); // Ajout d'un log pour le statut de la réponse

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data); // Ajout d'un log pour les données de la réponse

        setDatas(data);
        console.log(data, "mygroups");
      }
    } catch (error) {
      console.error("error fetching groupe", error.message);
    }
  }
}
