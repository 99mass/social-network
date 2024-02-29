import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { successNotification } from "../utils/sweeAlert";
import { Groupstodiscover } from "./getGroup";
import { getDatasProfilGroup } from "./group_profile";

export async function JoingGroupRequestHandler(
  group_id,
  setDatasProfileGroup,
  setGroupDiscover
) {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(
      `${api.JoinGroupRequest}?groupid=${group_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (response.ok) {
      if (setDatasProfileGroup) {
        successNotification("The request has been successfully transmitted");
        getDatasProfilGroup(setDatasProfileGroup, group_id);
      }
      if (setGroupDiscover) {
        successNotification("The request has been successfully transmitted");
        Groupstodiscover(setGroupDiscover);
      }
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
}
