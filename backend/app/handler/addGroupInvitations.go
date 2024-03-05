package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
	websocket "backend/app/webSocket"
)

type GroupInvitationsRequest struct {
	UserID   string `db:"user_id" json:"user_id"`
	GroupID  string `db:"group_id" json:"group_id"`
	SenderID string `db:"sender_id" json:"sender_id"`
	Status   string `db:"status" json:"status"`
}

func AddGroupInvitations(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			// Authorization
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			// Validate and save groups informations
			var groupInvitationsReq GroupInvitationsRequest
			err = json.NewDecoder(r.Body).Decode(&groupInvitationsReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}

			//Add request invitation to users invitated
			_, err = controller.GetGroupByID(db, groupInvitationsReq.GroupID)
			if err != nil {
				helper.SendResponseError(w, "error", "this group doesn't exit", http.StatusBadRequest)
				log.Println("the user try to add member in a group that doesn't exist")
				return
			}
			//Add request invitation to users invitated

			var groupInvitations models.Group_Invitations
			groupInvitations.UserID = groupInvitationsReq.UserID
			groupInvitations.GroupID = groupInvitationsReq.GroupID
			groupInvitations.SenderID = sess.UserID.String()
			groupInvitations.Status = "waiting"

			err = controller.CreateGroupInvitations(db, groupInvitations)
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("internal ERROR from database: ", err.Error())
				return
			}
			websocket.NotificationGroupInvitation(db, sess.UserID.String(), groupInvitations.GroupID, groupInvitations.UserID)
			websocket.BroadcastUserList(db)
			

			helper.SendResponse(w, nil, http.StatusOK)
			log.Println("Invitation created successfully")

		default:
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
