import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const getAllEvents = async (groupId, setAllEvents) => {
    if (groupId) {
        try {
            const sessionId = getSessionCookie();

            const response = await fetch(`${api.GetEvents}?group_id=${groupId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: sessionId,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAllEvents(data);
            }
            else{
                const data = await response.json();
                console.log('error', data.message);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error.message);
        }
    }
};