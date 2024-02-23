package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

type ProfilGroupToSend struct {
	GroupInfos      models.GroupInfos `json:"GroupInfos"`
	UsersNotInGroup []models.User     `json:"usersNotInGroup"`
	AllPost         []models.Post     `json:"allPost"`
}

func ProfilGroupHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)

			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			// check user id format
			groupId, err := utils.TextToUUID(r.URL.Query().Get("id"))
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			// get the user
			groupInfo, err := controller.GetGroupInfosById(db, sess.UserID, groupId)
			if err != nil {
				helper.SendResponseError(w, "error", "group doesn't exist", http.StatusBadRequest)
				return
			}
			if groupInfo.AvatarPath != "" {
				groupInfo.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + groupInfo.AvatarPath)
				if err != nil {
					log.Println("enable to encode image avatar", err.Error())

				}
			}

			var profilGroup ProfilGroupToSend
			userNotInGroup, err := controller.GetNonGroupFollowers(db, sess.UserID, groupInfo.ID)
			if err != nil {
				helper.SendResponseError(w, "error", "follower problems", http.StatusBadRequest)
				return
			}
			profilGroup.GroupInfos = groupInfo
			profilGroup.UsersNotInGroup = userNotInGroup

			helper.SendResponse(w, profilGroup, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
