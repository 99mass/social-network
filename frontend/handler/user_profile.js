import { useEffect } from "react";
import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";
import { errorNotification, successNotification } from "../utils/sweeAlert";


export const getDatasProfilUser = async (setDatas) => {
    try {
        const sessionId = getSessionCookie();
        
        const response = await fetch(api.Profil, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionId
            }
        });

        // Vérifier le statut de la réponse
        if (!response.ok) {
            console.error('Failed to fetch profile data');

        }
        // Analyser la réponse JSON
        const data = await response.json();
        console.log('data', data);
        setDatas(data)

    } catch (error) {
        console.error('Error fetching profile data:', error.message);
    }
}


export const updateDataProfile = async (data, setDatas, setErrorMessage) => {

    try {
        const sessionId = getSessionCookie();
        const response = await fetch(api.UpdateProfilUser, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionId
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const datas = await response.json();
            console.log("profile", datas);
            successNotification('Update profile done')

            // actualiser les donnes 
            getDatasProfilUser(setDatas);


        } else {
            const errorData = await response.json();
            errorNotification(errorData.message)
            setErrorMessage(errorData.message);
        }
    } catch (error) {
        errorNotification(error)
        console.error("Error:", error);
        setErrorMessage("An error occurred while processing your request.");
    }
};