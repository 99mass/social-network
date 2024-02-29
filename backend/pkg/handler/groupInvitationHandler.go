package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	websocket "backend/pkg/webSocket"
	"database/sql"
	"log"
	"net/http"

	"github.com/gofrs/uuid"
)

type InvitationRequest struct {
	GroupID string `json:"group_id"`
}

func AccepGrpInvitation(db *sql.DB) http.HandlerFunc {
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
			log.Println("grid:", groupeID)
			// var invitationReq InvitationRequest
			_, err = controller.GetGroupByID(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "this group doesn't exit", http.StatusBadRequest)
				log.Println("the user try to add member in a group that doesn't exist")
				return
			}
			err = controller.AcceptRequestInvitations(db, sess.UserID.String(), groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "enable to accept this invitation", http.StatusBadRequest)
				log.Println("the request invitation can't be accepted due to" + err.Error())
				return
			}
			websocket.BroadcastUserList(db)
			

		default:
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")

		}

	}
}

func DeclineGrpInvitaton(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {
		case http.MethodPost:
			session := r.Header.Get("Authorization")
			sessId, err := uuid.FromString(session)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "format value session incorrect",
				}, http.StatusBadRequest)
				return
			}
			sess, err := controller.GetSessionByID(db, sessId)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "you're not authorized",
				}, http.StatusBadRequest)
				return
			}
			// var invitationReq InvitationRequest
			groupeID := r.URL.Query().Get("groupid")
			_userID := r.URL.Query().Get("userId")

			_, err = controller.GetGroupByID(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "this group doesn't exit", http.StatusBadRequest)
				log.Println("the user try to add member in a group that doesn't exist")
				return
			}

			if _userID == "" {
				err = controller.DeclineGroupInvitaton(db, sess.UserID.String(), groupeID)
				websocket.BroadcastUserList(db)
				
			} else {
				err = controller.DeclineGroupInvitaton(db, _userID, groupeID)
				websocket.BroadcastUserList(db)
				
			}

			if err != nil {
				helper.SendResponseError(w, "error", "enable to accept this invitation", http.StatusBadRequest)
				log.Println("the request invitation can't be accepted due to" + err.Error())
				return
			}
			err = controller.DeleteNotificationByUserID(db, _userID, "group_invitation")
			if err != nil {
				log.Println("error:", err.Error())
			}
			websocket.BroadcastUserList(db)
			

		default:
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")

		}

	}
}
