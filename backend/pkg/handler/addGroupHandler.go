package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	websocket "backend/pkg/webSocket"
)

type GroupRequest struct {
	Title             string   `json:"title"`
	Description       string   `json:"description"`
	AvatarPath        string   `json:"avatarpath"`
	AddedUsersToGroup []string `json:"addedUsersToGroup"`
}

func AddGroupHandler(db *sql.DB) http.HandlerFunc {
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
			var groupReq GroupRequest
			err = json.NewDecoder(r.Body).Decode(&groupReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}

			groupReq.Title = strings.TrimSpace(groupReq.Title)
			groupReq.Description = strings.TrimSpace(groupReq.Description)
			checkGroup, err := utils.CheckGroup(groupReq.Title, groupReq.Description)

			if !checkGroup {
				helper.SendResponseError(w, "erro", err.Error(), http.StatusBadRequest)
				return
			}

			dir := "./pkg/static/avatarImage/"
			groupImage, _err := utils.ReadAndSaveImage(groupReq.AvatarPath, dir)
			if _err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: _err.Error(),
				}, http.StatusBadRequest)
				helper.SendResponseError(w, "error", "Error saving image", http.StatusBadRequest)
				return
			}

			group := models.Group{
				Title:       groupReq.Title,
				Description: groupReq.Description,
				CreatorID:   sess.UserID.String(),
				AvatarPath:  groupImage,
			}
			// Create the groupe
			groupID, err := controller.CreateGroup(db, group)
			if err != nil {
				log.Println("Unable to create the post: ", err)
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Unable to create the post",
				}, http.StatusInternalServerError)
				return
			}
			//Add the groupe creator to the groupe members
			creator := models.Group_Members{
				GroupID:   groupID.String(),
				UserID:    sess.UserID.String(),
				IsCreator: true,
			}
			err = controller.CreateGroupMembers(db, creator)
			if err != nil {
				helper.SendResponseError(w, "error", "Can't add the creator to the groupe members", http.StatusBadRequest)
				return
			}
			//Add request invitation to users invitated
			if groupReq.AddedUsersToGroup != nil {
				for _, userId := range groupReq.AddedUsersToGroup {
					var groupInvitations models.Group_Invitations
					groupInvitations.UserID = userId
					groupInvitations.GroupID = groupID.String()
					groupInvitations.SenderID = sess.UserID.String()
					groupInvitations.Status = "waiting"

					err = controller.CreateGroupInvitations(db, groupInvitations)
					if err != nil {
						helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
						log.Println("internal ERROR from database: ", err.Error())
						return
					}
					websocket.NotificationGroupInvitation(db,sess.UserID.String(), groupID.String(), userId)
					websocket.BroadcastUserList(db)
				}
			}

			helper.SendResponse(w, nil, http.StatusOK)
			log.Println("group created successfully")

		default:
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
