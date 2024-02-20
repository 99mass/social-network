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
      setDatas(null);
    } else {
      const data = await response.json();
      setDatas(data);
    }
  } catch (error) {
    setDatas(null);
    console.error("Error fetching  Friend Lists data:", error.message);
  }
};
export const getOlrequestFriend = async (setoldFriend) => {
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
      setoldFriend(data);
    } else {
      setoldFriend(null);
    }
  } catch (error) {
    setoldFriend(null);
  }
};

// liste amies
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
export const getFollowers = async (setFollowerList) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.getFollowers, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    // Vérifier le statut de la réponse
    if (response.ok) {
      const data = await response.json();
      setFollowerList(data);
    }
  } catch (error) {
    console.error("Error fetching Followers data:", error.message);
  }
};
export const getFollowingUsers = async (setFollowingUsersList) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.getFollingUsers, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    // Vérifier le statut de la réponse
    if (response.ok) {
      const data = await response.json();
      setFollowingUsersList(data);
    }
  } catch (error) {
    console.error("Error fetching Followers data:", error.message);
  }
};

// fonctions cote user qui demades amie
export const askForFriends = async (userid, setPosts, setDatas) => {
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
        if (setPosts) getPostsUser(setPosts);
        if (setDatas) getDatasProfilUser(setDatas, userid);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const UnfollowUser = async (userid, setPosts, setFollowingUsersList) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Unfollowuser + `?userid=${userid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (response.ok) {
        if (setPosts) getPostsUser(setPosts);
        if (setFollowingUsersList) getFollowingUsers(setFollowingUsersList);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};
//Fonctions  cote user a qui on demande amie
export const confirmFriends = async (userid, setDatas, setoldFriend) => {
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
        if (setoldFriend) getOlrequestFriend(setoldFriend);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const deleteAskingFriends = async (
  userid,
  setDatas,
  setoldFriend,
  setFollowerList,
  setFollowingUsersList
) => {
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
        if (setoldFriend) getOlrequestFriend(setoldFriend);
        if (setFollowerList) getFollowers(setFollowerList);
        if (setFollowingUsersList) getFollowingUsers(setFollowingUsersList);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};
