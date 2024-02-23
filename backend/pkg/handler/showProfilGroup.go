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
	ListMembreGroup []models.User     `json:"listMembreGroup"`
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

			for i, userNot := range userNotInGroup {
				if userNot.AvatarPath != "" {
					encodedAvatar, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + userNot.AvatarPath)
					if err != nil {
						log.Println("enable to encode image avatar", err.Error())
						continue
					}
					userNotInGroup[i].AvatarPath = encodedAvatar
				}
			}

			listMember, err := controller.GetGroupMembers(db, groupId.String())
			if err != nil {
				helper.SendResponseError(w, "error", "Don't get group Members", http.StatusBadRequest)
				return
			}

			for i, member := range listMember {
				if member.AvatarPath != "" {
					encodedAvatar, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + member.AvatarPath)
					if err != nil {
						log.Println("enable to encode image avatar", err.Error())
						continue
					}
					listMember[i].AvatarPath = encodedAvatar
				}
			}
			profilGroup.GroupInfos = groupInfo
			profilGroup.UsersNotInGroup = userNotInGroup
			profilGroup.ListMembreGroup = listMember

			helper.SendResponse(w, profilGroup, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
