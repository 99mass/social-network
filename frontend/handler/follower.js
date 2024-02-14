import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const askForFriends = async (userid) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Followuser + `?userid=${userid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        console.error("Failed to fetch profile data");
      }

      console.log("yesss following.");
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};
