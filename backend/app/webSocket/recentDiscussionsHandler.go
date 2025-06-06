package websocket

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/utils"
)

// RecentDiscussionsHandler est le handler pour obtenir les discussions récentes d'un utilisateur.
func RecentDiscussionsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessid, err := utils.TextToUUID(r.URL.Query().Get("Authorization"))
		if err != nil {
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
			return
		}
		sess, err := controller.GetSessionByID(db, sessid)
		if err != nil {
			helper.SendResponseError(w, "error", "invalid session", http.StatusBadRequest)
			return
		}
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		defer conn.Close()

		discussions, err := controller.GetRecentDiscussions(db, sess.UserID.String())
		if err != nil {
			log.Println("Error fetching recent discussions:", err)
			return
		}
		
		detailMessage, _ := controller.GetNotificationMessageCountByTypeAndSenderID(db, sess.UserID.String(), "private_message")
		for i,discuss := range discussions{
			for _,det:= range detailMessage{
				if discuss.OtherUserID == det.SenderID{
					discussions[i].CountMessageUnRead = det.CountMessage
				}
			}
			
		}
		
		
		// Envoyer les discussions récentes via le WebSocket
		err = conn.WriteJSON(discussions)
		if err != nil {
			log.Println("Error sending recent discussions:", err)
			return
		}
	}
}
