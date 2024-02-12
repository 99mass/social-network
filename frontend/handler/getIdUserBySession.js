import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getUserIdBySession = async (setIdUser) => {
  let sessionID = getSessionCookie();

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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionID,
      },
    });

    if (response.ok) {
      const idUser = await response.json();
      
      console.log("idUser:", idUser);
    } else {
      const errorData = await response.json();
      console.error("errorData:", errorData.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
