import { createSessionCookie } from "../utils/cookies";

export const sendData = async (
  linkApi,
  data,
  router,
  pageRedirect,
  setErrorMessage,
  createCookie
) => {
  try {
    const response = await fetch(linkApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok && response.status) {
      const cookieDatas = await response.json();

      if (createCookie)
        createSessionCookie(cookieDatas.value, cookieDatas.expiration);
      router.push("/" + pageRedirect);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message);
    }
  } catch (error) {
    console.error("Error:", error);
    setErrorMessage("An error occurred while processing your request.");
  }
};
