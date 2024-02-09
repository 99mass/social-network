import { api } from "../utils/api";
import { getSessionCookie } from "../utils/cookies";

  
  export const getDatasProfilUser= async (setDatas)=> {
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
        setDatas(data)
  
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    }
