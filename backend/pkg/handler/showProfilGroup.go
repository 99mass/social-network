package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	websocket "backend/pkg/webSocket"
)

type ProfilGroupToSend struct {
	GroupInfos        models.GroupInfos       `json:"GroupInfos"`
	UsersNotInGroup   []models.UsersNoInGroup `json:"usersNotInGroup"`
	ListMembreGroup   []models.User           `json:"listMembreGroup"`
	AllPost           []models.Post           `json:"allPost"`
	IsMember          bool                    `json:"isMember"`
	IsJoinRequestSend bool                    `json:"isJoinRequest"`
	Iscreator         bool                    `json:"isCreator"`
	IsInvitationSend  bool                    `json:"isInvited"`
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
				if userNot.User.AvatarPath != "" {
					encodedAvatar, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + userNot.User.AvatarPath)
					if err != nil {
						log.Println("enable to encode image avatar", err.Error())
						continue
					}
					userNotInGroup[i].User.AvatarPath = encodedAvatar
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

			isInvited, _ := controller.IsInvitationSend(db, groupId.String(), sess.UserID.String())
			if isInvited {
				profilGroup.IsInvitationSend = true
			}

			isJoinRequest, _ := controller.IsJoinRequestSend(db, sess.UserID.String(), groupId.String())
			if isJoinRequest {
				profilGroup.IsJoinRequestSend = true
			}

			isMember, _ := controller.IsMember(db, sess.UserID.String(), groupId.String())
			if isMember {
				profilGroup.IsMember = true
			}
			iscreator, err := controller.IsUserGroupCreator(db, sess.UserID.String(), groupId.String())
			if err != nil {
				helper.SendResponseError(w, "error", "Don't get a creator", http.StatusBadRequest)
				return
			}
			if iscreator && isMember {
				profilGroup.Iscreator = true
			}

			profilGroup.GroupInfos = groupInfo
			profilGroup.UsersNotInGroup = userNotInGroup
			profilGroup.ListMembreGroup = listMember

			websocket.BroadcastUserList(db)
			helper.SendResponse(w, profilGroup, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
