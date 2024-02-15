import { api } from "../utils/api";
import {
  createSessionCookie,
  deleteSessionCookie,
  getSessionCookie,
} from "../utils/cookies";

export const sendSession = async () => {
  const sessionID = getSessionCookie();
  
  if (
    typeof sessionID === undefined ||
    sessionID === undefined ||
    sessionID === null ||
    sessionID === ""
  ) {
    return false;
  }

  try {
    const response = await fetch(api.Session, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID }),
    });

    alert("Couldn't create session cookie")
    if (response.ok) {
      const cookieDatas = await response.json();
      createSessionCookie(cookieDatas.value, cookieDatas.expiration);
      return true;
    } else {
      const errorData = await response.json();
      deleteSessionCookie();
      // console.error("errorData:", errorData.message);
      return false;
    }
  } catch (error) {
    // console.error("Error:", error);
    return false;
  }
};
