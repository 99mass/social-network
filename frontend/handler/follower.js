import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getAskForFriendLists = async (setDatas) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.Requestfollow, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to fetch profile data");
    }
    const data = await response.json();
    setDatas(data);
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const getFriendsLists = async (userid, setDatas) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.users_follows + `?userid=${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (response.ok) {
        const data = await response.json();
        console.log("svs",userid);
        console.log("ddddd", data);
        setDatas(data);
       
      }
    } catch (error) {
      console.error("Error fetching Friends data:", error.message);
    }
  }
};

export const askForFriends = async (userid) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Followuser + `?userid=${userid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        console.error("Failed to fetch profile data");
      }

      console.log("yesss following.");
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const confirmFriends = async (userid, setDatas) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Followuser + `?userid=${userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        console.error("Failed to fetch profile data");
      }

      getAskForFriendLists(setDatas);

      console.log("yesss confirmed following.");
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const deleteAskingFriends = async (userid, setDatas) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Followuser + `?userid=${userid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        console.error("Failed to fetch profile data");
      }

      getAskForFriendLists(setDatas);
      console.log("nooo deleting following.");
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};
