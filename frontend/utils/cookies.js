import Cookies from "js-cookie";

export const createSessionCookie = (sessionId, expiration) => {
  const expirationDate = new Date(expiration);
  Cookies.set("sessionID", sessionId, {
    expires: expirationDate,
  });
};


export const getSessionCookie = () => {
  return Cookies.get("sessionID");
};

export const isValideSession=()=>{
    const sessionID=getSessionCookie();
    if (sessionID) {
        return true
    }
    return false
}