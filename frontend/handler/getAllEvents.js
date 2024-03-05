import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

export const ListAllEvents = async (groupId, setAllEvents) => {
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
            else {
                const data = await response.json();
                console.error('error', data.message);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error.message);
        }
    }
};

export const eventPartipants = async (event_id, choosen_option, group_id, setAllEvents) => {
    try {
        const sessionId = getSessionCookie();
        const response = await fetch(`${api.Create_participants_event}?event_id=${event_id}&choosen_option=${choosen_option}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: sessionId,
            },
        });

        if (response.ok) {
            if (setAllEvents) ListAllEvents(group_id, setAllEvents);

        } else {
            const errorData = await response.json();
            console.error('Errorsss', errorData.message);
        }
    } catch (error) {
        console.error("Error fetching profile data:", error.message);
    }
};


// lists participants events

export const list_response_events = async (event_id, setDatas) => {
    try {
        const sessionId = getSessionCookie();
        const response = await fetch(`${api.list_response_events}?event_id=${event_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: sessionId,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setDatas(data); // Utilisez setDatas pour mettre à jour l'état
        } else {
            const errorData = await response.json();
            console.error('Error', errorData.message);
        }
    } catch (error) {
        console.error("Error fetching lists data:", error.message);
    }
};

