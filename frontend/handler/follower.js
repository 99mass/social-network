import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { getPostsUser } from "./getPostsUser";

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
      console.error("Failed to fetch Friend Lists data");
    } else {
      const data = await response.json();
      setDatas(data);
    }
  } catch (error) {
    console.error("Error fetching  Friend Lists data:", error.message);
  }
};
export const getOldestrequestfollow = async (setOldestrequestfollowDatas) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.oldestrequestfollow, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    // Vérifier le statut de la réponse
    if (response.ok) {
      const data = await response.json();
      setOldestrequestfollowDatas(data);
    }
  } catch (error) {
    console.error("Error fetching  Oldestrequestfollow data:", error.message);
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
        setDatas(data);
      }
    } catch (error) {
      console.error("Error fetching Friends data:", error.message);
    }
  }
};

export const askForFriends = async (userid, setPosts) => {
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
      if (response.ok) {
        getPostsUser(setPosts);
      }

    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};
export const DeleteAskForFriends = async (userid, setPosts) => {
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
      if (response.ok) {
        getPostsUser(setPosts);
      }

    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const confirmFriends = async (userid, setDatas, setOldestrequestfollowDatas) => {
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
      } else {

        if (setDatas) getAskForFriendLists(setDatas);
        if (setOldestrequestfollowDatas) getOldestrequestfollow(setOldestrequestfollowDatas);
      }

    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const deleteAskingFriends = async (userid, setDatas, setOldestrequestfollowDatas) => {
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
      } else {

        if (setDatas) getAskForFriendLists(setDatas);
        if (setOldestrequestfollowDatas) getOldestrequestfollow(setOldestrequestfollowDatas);
      }

    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};
