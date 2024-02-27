import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getJoinGroupRequest = async (groupid, setJoinGroupRequest) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(`${api.GetJoinGroupRequest}?groupid=${groupid}`, {
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
      setJoinGroupRequest(data);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};