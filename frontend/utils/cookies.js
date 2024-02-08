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
export const deleteSessionCookie = () => {
  Cookies.remove("sessionID");
};

export const isValideSession = async () => {
  let sessionID = getSessionCookie();
  if (sessionID) {
    let isSession = await sendSession(api.Session, sessionID);
    if (isSession) {
      return true;
    }
    deleteSessionCookie();
    return false;
  }
  return false;
};
