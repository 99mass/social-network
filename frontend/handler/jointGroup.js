import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export async function JoingGroupRequestHandler(setDatas,id) {
  try {
    const sessionId = getSessionCookie();
    console.log("session:",sessionId)
    const response = await fetch(api.JoinGroupRequest+`?groupid=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("datagroup:",data)
    //   setDatas(data);
    }
  } catch (error) {
    console.error("error fetching groupe", error.message);
  }
}