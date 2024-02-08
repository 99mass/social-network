import { api } from "../utils/api";
import { deleteSessionCookie, getSessionCookie } from "../utils/cookies";

export const logout = async () => {
  const linkApi = api.Logout;
  const sessionID = getSessionCookie();
  try {
    const response = await fetch(linkApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID }),
    });

    if (response.ok) {
      deleteSessionCookie();
      return true;
    } else {
      const errorData = await response.json();
      console.error("errorData:", errorData.message);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
