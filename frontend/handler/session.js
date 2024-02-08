import { createSessionCookie } from "../utils/cookies";

export const sendSession = async (linkApi, sessionID) => {
  try {
    const response = await fetch(linkApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({sessionID}),
    });

    if (response.ok) {
        const cookieDatas = await response.json();
        console.log(cookieDatas);
        createSessionCookie(cookieDatas.value, cookieDatas.expiration);
        return true;
      } else {
        const errorData = await response.json();
        console.error("errorData:", errorData.message);
        return false;
      }

    // if (response.ok && response.status) {
    //   const cookieDatas = await response.json();
    //   console.log(cookieDatas);
    //   createSessionCookie(cookieDatas.value, cookieDatas.expiration);
    //   return true;
    // } else {
    //   const errorData = await response.json();
    //   console.error("errorData:", errorData.message);
    //   return false;
    // }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
