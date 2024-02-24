import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getDatasAutherUserInfos = async (userid,setDatasUser2) => {
    if (userid) {
      try {
        const sessionId = getSessionCookie();
  
        const response = await fetch(`${api.UserInfos}?userid=${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setDatasUser2(data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    }
  };