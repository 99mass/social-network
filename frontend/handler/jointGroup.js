import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { getDatasProfilGroup } from "./group_profile";

export async function JoingGroupRequestHandler(group_id, setDatasProfileGroup) {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(`${api.JoinGroupRequest}?groupid=${group_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      getDatasProfilGroup(setDatasProfileGroup, group_id);
      console.log("ok");
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
}
