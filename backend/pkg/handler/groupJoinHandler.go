package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/utils"
	websocket "backend/pkg/webSocket"
	"database/sql"
	"log"
	"net/http"
)

func JoingGroupRequest(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("try join group")
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			log.Println("authorization checked")

			groupeID := r.URL.Query().Get("groupid")
			log.Println("grid:", groupeID)
			// var invitationReq InvitationRequest
			_, err = controller.GetGroupByID(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "this group doesn't exit", http.StatusBadRequest)
				log.Println("the user try to add member in a group that doesn't exist")
				return
			}
			err = controller.JoinGroupRequest(db, sess.UserID.String(), groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "enable to join the group", http.StatusBadRequest)
				log.Println("the request invitation can't be accepted due to" + err.Error())
				return
			}

			creator, err := controller.GetCreatorByGroupID(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("can't get the creator by the groupID" + err.Error())
				return
			}
			websocket.NotificationJoinGroup(db, sess.UserID.String(), groupeID, creator)
			websocket.BroadcastUserList(db)
			log.Println("Join group request successful")
			helper.SendResponse(w, nil, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "methode not allowed", http.StatusMethodNotAllowed)
			log.Println("the request can't be accepted", r.Method)
		}
	}
}
