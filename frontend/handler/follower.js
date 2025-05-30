import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { getPostsUser } from "./getPostsUser";
import { getPostsGroup } from "./getPostsGroup";
import { getDatasProfilUser } from "./user_profile";
import { unFollowNotification } from "../utils/sweeAlert";

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

    const response = await fetch(api.Oldestrequestfollow, {
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

      const response = await fetch(`${api.Users_follows}?userid=${userid}`, {
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
export const getFollowers = async (setFollowerList,idUser) => {
  if (!idUser) return
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(`${api.GetFollowers}?userid=${idUser}`, {
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

export async function CountFollower(userid, setDatas) {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(`${api.CountFollower}?userid=${userid}`, {
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
      console.error("error fetching count Followr", error.message);
    }
  }
}
export const getFollowingUsers = async (setFollowingUsersList,idUser) => {
  if(!idUser) return
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(`${api.GetFolliwgUsers}?userid=${idUser}`, {
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
export const askForFriends = async (
  userid,
  setPosts,
  setDatasProfile,
  groupeid,
  setPostsGroup
) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(`${api.Followuser}?userid=${userid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (response.ok) {
        if (setPosts) getPostsUser(setPosts);
        if (setDatasProfile) getDatasProfilUser(setDatasProfile, userid);
        if (setPostsGroup && groupeid) getPostsGroup(groupeid, setPostsGroup);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  }
};

export const UnfollowUser = async (
  userid,
  setPosts,
  setFollowingUsersList,
  setDatasProfile,
  groupeid,
  setPostsGroup
) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(`${api.Unfollowuser}?userid=${userid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      // Vérifier le statut de la réponse
      if (response.ok) {
        unFollowNotification();
        if (setPosts) getPostsUser(setPosts);
        if (setFollowingUsersList) getFollowingUsers(setFollowingUsersList);
        if (setDatasProfile) getDatasProfilUser(setDatasProfile, userid);
        if (setPostsGroup) getPostsGroup(groupeid, setPostsGroup);
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

      const response = await fetch(`${api.Followuser}?userid=${userid}`, {
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

      const response = await fetch(`${api.Followuser}?userid=${userid}`, {
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
