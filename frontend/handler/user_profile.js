import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";

export const getDatasProfilUser = async (setDatas, userid) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(`${api.Profil}?userid=${userid}`, {
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

export const updateDataProfile = async (
  data,
  userid,
  setDatas, 
  setErrorMessage,
  handleButtonClick
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
      successNotification("Update profile done");
      getDatasProfilUser(setDatas, userid);
      handleButtonClick(1);
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
      setErrorMessage(errorData.message);
    }
  } catch (error) {
    errorNotification("An error occurred while processing your request.");
    setErrorMessage("An error occurred while processing your request.");
  }
};
