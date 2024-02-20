import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getGroupFollow = async (userid, setGroupFollow) => {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(`${api.userPosts}?user_id=${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch PostsUserCreated  data");
      } else {
        const data = await response.json();
        setGroupFollow(data);
      }
    } catch (error) {
      console.error("Error fetching PostsUserCreated data:", error.message);
    }
  }
};

export async function getMygroups(userid, setDatas) {
  if (userid) {
    try {
      const sessionId = getSessionCookie();

      const response = await fetch(api.Mygroups + "?user_id=${userid", {
        method: "GET",
        headers: {
          Content_type: "application/json",
          Authorization: sessionId,
        },
      });
      if (response.ok) {
        const data = await response.json();

        setDatas(data);
        console.log(data, "mygroups");
      }
    } catch (error) {
      console.error("error fetching groupe", error.message);
    }
  }
}
