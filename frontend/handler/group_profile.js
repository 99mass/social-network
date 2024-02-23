
import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";

export const getDatasProfilGroup = async (setDatas, groudId ) => {
    if (groudId) {
      try {
        const sessionId = getSessionCookie();
  
        const response = await fetch(api.ProfilGroup + `?id=${groudId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setDatas(data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    }
  };
  