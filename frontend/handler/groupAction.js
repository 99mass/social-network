import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

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
      api.Accept_group_invitation + "?groupid=" + group_id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
        //   body: JSON.stringify({ group_id }),
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
        api.Decline_group_invitation + "?groupid=" + group_id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
          //   body: JSON.stringify({ group_id }),
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
