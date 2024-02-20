import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";
// import { getPostsUser } from "./getPostsUser";

export const AddGroup = async (data, setGroupFrom, setGroups) => {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.AddGroup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      successNotification("Group added successful you can see it in the home  or  profile page.");
       
    //   setPostForm(false);
    //   getPostsUser(setPosts);
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};
