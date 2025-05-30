import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { AddGroup } from "./sendGroup";
import { errorNotification, successNotification } from "../utils/sweeAlert";
import { getDatasProfilGroup } from "./group_profile";
import { getPostsGroup } from "./getPostsGroup";
import { getJoinGroupRequest } from "./getJoinGroupRequest";


export const ShowGroupInvitation = async (setRequestLists) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.Show_group_invitation, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to fetch ShowGroupInvitation data");
    } else {
      const data = await response.json();
      setRequestLists(data);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const AcceptGroupInvitation = async (group_id, setRequestLists) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(
      `${api.Accept_group_invitation}?groupid=${group_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      ShowGroupInvitation(setRequestLists);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const DeclineGroupInvitation = async (group_id, setRequestLists) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(
      `${api.Decline_group_invitation}?groupid=${group_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      ShowGroupInvitation(setRequestLists);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const AddPostGroup = async (data, setPostsGroup, groupId, section) => {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.AddPostGroup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      successNotification("Post Group added successful.");
      if (groupId && setPostsGroup) {
        getPostsGroup(groupId, setPostsGroup);
        section.section1 = true;
        section.section2 = false;
      }

    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};

export const AddGroupInvitations = async (
  userId,
  groupId,
  setDatasProfileGroup
) => {
  try {
    const sessionId = getSessionCookie();
    const data = {
      group_id: groupId,
      user_id: userId,
    };
    const response = await fetch(api.AddGroupInvitation, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      getDatasProfilGroup(setDatasProfileGroup, groupId);
      // successNotification(
      //   "Group invitations added successful you can see it in the home  or  profile page."
      // );
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};



export const DeclineInvitation = async (group_id, userid, setDatasProfileGroup) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(
      `${api.Decline_group_invitation}?groupid=${group_id}&userId=${userid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      getDatasProfilGroup(setDatasProfileGroup, group_id);

    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};



export const leaveInGroup = async (group_id, setDatasProfileGroup) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(
      `${api.Leave_in_group}?groupid=${group_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      getDatasProfilGroup(setDatasProfileGroup, group_id);

    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};




export const AcceptJoinGroupRequest = async (userId, group_id, setJoinRequestLists) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(
      `${api.Accept_join_request}?groupid=${group_id}&userid=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      getJoinGroupRequest(setJoinRequestLists, group_id)
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const DeclineJoinGroupRequest = async (group_id, setJoinRequestLists, callback, userId, creatorid) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(
      `${api.Decline_join_request}?groupid=${group_id}&userid=${userId}&creatorid=${creatorid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      callback(setJoinRequestLists, group_id)
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};

export const AcceptGroupInvitProfil = async (group_id, setDatasProfileGroup) => {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(
      `${api.Accept_group_invitation}?groupid=${group_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      }
    );

    // Vérifier le statut de la réponse
    if (!response.ok) {
      console.error("Failed to send  data");
    } else {
      getDatasProfilGroup(setDatasProfileGroup, group_id);
    }
  } catch (error) {
    console.error("Error fetching profile data:", error.message);
  }
};