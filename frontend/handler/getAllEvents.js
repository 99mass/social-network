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


// export const eventPartipants = async (data, setDatas) => {
    
//         // console.log(eventId, chosenOption,"aaaaa");
//         // return
//         try {
//             const sessionId = getSessionCookie();

//             // const response = await fetch(`${api.Create_participants_event}?event_id=${eventId}?chosen_option=${chosenOption}`, {
//             const response = await fetch(`${api.Create_participants_event}`, {

//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: sessionId,
//                 },
//                 body: JSON.stringify(data)
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log(data ,"OPtionGo");
//                 // setDatas(data);
//             }
//             else{
//                 const data = await response.json();
//                 console.log('error', data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching profile data:", error.message);
//         }
    
// };

export const eventPartipants = async (event_id, choosen_option, setDatas) => {
    try {
        const sessionId = getSessionCookie();
        // console.log("Sending data:", data); // Log the data being sent
        const response = await fetch(`${api.Create_participants_event}?even_id=${event_id}&chosen_option${choosen_option}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: sessionId,
            },
            // body: JSON.stringify(data)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data, "OptionGo");
            // setDatas(data);
        } else {
            const errorData = await response.json();
            console.error('Errorsss', errorData.message);
            // Consider handling specific HTTP status codes here
        }
    } catch (error) {
        console.error("Error fetching profile data:", error.message);
        // Consider handling network errors or other exceptions here
    }
};