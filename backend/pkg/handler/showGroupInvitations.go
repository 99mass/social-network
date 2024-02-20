package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"database/sql"
	"log"
	"net/http"

	"github.com/gofrs/uuid"
)

func ShowGroupInvitation(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
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
			group, err := controller.GetGroupsInvitation(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusInternalServerError)
				return
			}
			var groupInf []models.GroupInfos
			for _, g := range group {
				var gInf models.GroupInfos
				numberOfMember, err := controller.GetNumberOfMember(db, g.ID)
				if err != nil {
					log.Println("error while getting the number of member for a group ")
					helper.SendResponseError(w, "error", "we got an issue", http.StatusInternalServerError)
					return
				}
				if g.AvatarPath != "" {
					g.AvatarPath, err = helper.EncodeImageToBase64(g.AvatarPath)
					if err != nil {
						log.Println("enable to encode avatar image for group")
					}
				}
				gInf.ID = g.ID
				gInf.AvatarPath = g.AvatarPath
				gInf.Title = g.Title
				gInf.NbrMembers = numberOfMember
				groupInf = append(groupInf, gInf)
			}

			helper.SendResponse(w, groupInf, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}

	}
}
