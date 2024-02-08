import Cookies from "js-cookie";
import { sendSession } from "../handler/session";
import { api } from "./api";

export const createSessionCookie = (sessionId, expiration) => {
  const expirationDate = new Date(expiration);
  Cookies.set("sessionID", sessionId, {
    expires: expirationDate,
  });
};

export const getSessionCookie = () => {
  return Cookies.get("sessionID");
};

export const isValideSession = async () => {
  const sessionID = getSessionCookie();
  if (sessionID) {
    let isSession = await sendSession(api.Session, sessionID);
    if (isSession) {
      console.log("isSession:", isSession);
      return true;
    }
    return false;
  }
  return false;
};
