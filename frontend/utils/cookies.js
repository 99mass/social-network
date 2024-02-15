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
  try {
    const isSession = await sendSession();
    return isSession;
  } catch (error) {
    return false;
  }
};
