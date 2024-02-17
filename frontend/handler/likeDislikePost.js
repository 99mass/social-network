import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { getPostsUser } from "./getPostsUser";

export const likeDislikePost = async (data, setPosts) => {
    try {
        const sessionId = getSessionCookie();

        const response = await fetch(api.likeDslikepost, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: sessionId,
            },
            body: JSON.stringify(data),
        });

        // Vérifier le statut de la réponse
        if (response.ok) {
            getPostsUser(setPosts);
        }

    } catch (error) {
        console.error("Error fetching profile data:", error.message);
    }
};