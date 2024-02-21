import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export async function getMygroups(setDatas) {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.Mygroups, {
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
    console.error("error fetching groupe", error.message);
  }
}
