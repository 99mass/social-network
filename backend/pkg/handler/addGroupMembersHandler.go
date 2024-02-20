package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gofrs/uuid"
)

type AddMemberRequest struct {
	GroupID string   `json:"group_id"`
	Members []string `json:"members"`
}

func AddMember(db *sql.DB) http.HandlerFunc {
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
			var addMember AddMemberRequest
			err = json.NewDecoder(r.Body).Decode(&addMember)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			ok, err := controller.IsMember(db, sess.UserID.String(), addMember.GroupID)
			if !ok {
				helper.SendResponseError(w, "error", "you're not a member of this group", http.StatusBadRequest)
				log.Println("this user is not authorized to add member in this group" + err.Error())
				return
			}

			_, err = controller.GetGroupByID(db, addMember.GroupID)
			if err != nil {
				helper.SendResponseError(w, "error", "this group doesn't exit", http.StatusBadRequest)
				log.Println("the user try to add member in a group that doesn't exist")
				return
			}

			if addMember.Members != nil {
				for _, userId := range addMember.Members {
					ok, err := controller.IsMember(db, userId, addMember.GroupID)
					if !ok {
						//helper.SendResponseError(w, "error", "there is member who is also present in the group", http.StatusBadRequest)
						log.Println("this user is a member who is also present in the group" + err.Error())
						continue
					}
					var groupInvitations models.Group_Invitations
					groupInvitations.UserID = userId
					groupInvitations.GroupID = addMember.GroupID
					groupInvitations.SenderID = sess.UserID.String()
					groupInvitations.Status = "pending"

					err = controller.CreateGroupInvitations(db, groupInvitations)
					if err != nil {
						helper.SendResponse(w, models.ErrorResponse{
							Status:  "error",
							Message: "we got an issue",
						}, http.StatusInternalServerError)
						log.Println("internal ERROR from database: ", err.Error())
						return
					}
				}
			}

		}

	}

}
