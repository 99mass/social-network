import Cookies from "js-cookie";
export  const createSessionCookie = (sessionId) => {
  Cookies.set("sessionID", sessionId, { expires: 7 }); 
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