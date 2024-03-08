import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";

export const AddEvent = async (data, setSection) => {

  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.Create_events, {
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
      if (setSection) {
        setSection({
          section1: false,
          section2: false,
          section3: true,
          section4: false,
          section5: false,
        });
      }

    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};