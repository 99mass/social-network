import { useEffect } from "react";
import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";

export const getDatasProfilUser = async (setDatas, userid) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Profil + `?userid=${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (response.ok) {
        // Analyser la réponse JSON
        const data = await response.json();
        setDatas(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const updateDataProfile = async (
  data,
  userid,
  setDatas,
  setErrorMessage,
  CloseEditForm
) => {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.UpdateProfilUser, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const datas = await response.json();
      successNotification("Update profile done");
      // actualiser les donnes
      getDatasProfilUser(setDatas, userid);
      
      CloseEditForm()
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
      setErrorMessage(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
    console.error("Error:", error);
    setErrorMessage("An error occurred while processing your request.");
  }
};
