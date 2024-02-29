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
            else{
                const data = await response.json();
                console.log('error', data.message);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error.message);
        }
    }
};


export const eventPartipants = async (eventId, chosenOption, setDatas) => {
    if (eventId) {
        // console.log(eventId, chosenOption,"aaaaa");
        // return
        try {
            const sessionId = getSessionCookie();

            // const response = await fetch(`${api.Create_participants_event}?event_id=${eventId}?chosen_option=${chosenOption}`, {
            const response = await fetch(`${api.Create_participants_event}?event_id=${eventId}&chosen_option=${chosenOption}`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: sessionId,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data ,"OPtionGo");
                // setDatas(data);
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