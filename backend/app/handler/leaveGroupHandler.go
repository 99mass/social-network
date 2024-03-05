package handler

import (
	"backend/app/controller"
	"backend/app/helper"
	"backend/app/utils"
	websocket "backend/app/webSocket"
	"database/sql"
	"log"
	"net/http"
)

func LeaveInGroupHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			groupeID := r.URL.Query().Get("groupid")

			iscreator, _ := controller.IsUserGroupCreator(db, sess.UserID.String(), groupeID)

			if iscreator {
				log.Println("Error: Not allowed to leave  in  a group")
				helper.SendResponseError(w, "error", "you are not allowed to leave in a group", http.StatusBadRequest)
				return
			}

			err = controller.LeaveInGroupRequest(db, sess.UserID.String(), groupeID)
			if err != nil {
				log.Println("Error:  leave group request failled:", err)
				helper.SendResponseError(w, "error", "something goes wrong", http.StatusBadRequest)
				return
			}
			controller.DeleteNotificationJoinGroup(db, sess.UserID.String(), groupeID, "chat_group")
			websocket.BroadcastUserList(db)
			helper.SendResponse(w, nil, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "methode not allowed", http.StatusMethodNotAllowed)
			log.Println("the request can't be accepted", r.Method)
		}
	}
}
