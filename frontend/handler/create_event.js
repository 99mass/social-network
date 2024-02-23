import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";

export const AddEvent = async (data) => {
 
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
        "Event added successful."
      );
      
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};