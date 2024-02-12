import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";

export const AddPostUser = async (data) => {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.Addpost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const datas = await response.json();
      successNotification("Post added successful.");
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
    console.error("Error:", error);
  }
};
