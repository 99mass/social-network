import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";
import { getMygroups } from "./getGroup";

export const AddGroup = async (data, setGroups) => {

  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.AddGroup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      successNotification(
        "Group added successful you can see it in the group page."
      );
      if (setGroups) getMygroups(setGroups);

    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};
