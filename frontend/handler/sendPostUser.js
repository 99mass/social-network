import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";
import { getPostsUser } from "./getPostsUser";

export const AddPostUser = async (data, setPostForm, setPosts, togglePostForm) => {
  try {
    const sessionId = getSessionCookie();
    const response = await fetch(api.Addpost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      successNotification("Post added successful you can see it in the home  or  profile page.");
      if (setPostForm) setPostForm(false);
      if (setPosts) getPostsUser(setPosts);
    } else {
      const errorData = await response.json();
      errorNotification(errorData.message);
    }
  } catch (error) {
    errorNotification(error);
  }
};
