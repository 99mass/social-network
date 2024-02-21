import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export async function getMygroups(setDatas) {
  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.Groupsimanage, {
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


export async function Groupstodiscover(setDatas) {

  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.Groupstodiscover, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("data", data);
      setDatas(data);
    }
  } catch (error) {
    console.error("error fetching groupe", error.message);
  }

}

export async function MygroupsParticep(setDatas) {


  try {
    const sessionId = getSessionCookie();

    const response = await fetch(api.MygroupsParticep, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("datay", data);
      setDatas(data);
    }
  } catch (error) {
    console.error("error fetching groupe", error.message);
  }
  
}