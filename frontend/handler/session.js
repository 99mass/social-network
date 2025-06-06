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


    if (response.ok) {
      const cookieDatas = await response.json();
      createSessionCookie(cookieDatas.value, cookieDatas.expiration);
      return true;
    } else {
      deleteSessionCookie();
      return false;
    }
  } catch (error) {
    return false;
  }
};
