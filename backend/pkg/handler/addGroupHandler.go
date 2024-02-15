package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gofrs/uuid"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

type GroupRequest struct {
	Title             string   `json:"title"`
	Description       string   `json:"description"`
	AddedUsersToGroup []string `json:"addedUsersToGroup"`
}

func AddGroupHandler(db *sql.DB) http.HandlerFunc {
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
			var groupReq GroupRequest
			_err := json.NewDecoder(r.Body).Decode(&groupReq)
			if _err != nil {
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
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}

			group := models.Group{
				Title:       groupReq.Title,
				Description: groupReq.Description,
				CreatorID:   sess.UserID.String(),
			}

			result, err := controller.CreateGroup(db, group)
			if err != nil {
				log.Println("Unable to create the post: ", err)
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Unable to create the post",
				}, http.StatusInternalServerError)
				return
			}
			if groupReq.AddedUsersToGroup != nil {
				for _, userAdd := range groupReq.AddedUsersToGroup {
					var _groupMembers models.Group_Members
					_groupMembers.GroupID = result.String()
					_userId, err := controller.GetUserByNickName(db, userAdd)
					if err != nil {
						helper.SendResponse(w, models.ErrorResponse{
							Status:  "error",
							Message: "we got an issue",
						}, http.StatusInternalServerError)
						log.Println("internal ERROR from database: ", err.Error())
						return
					}

					_groupMembers.UserID = _userId.String()
					err = controller.CreateGroupMembers(db, &_groupMembers)
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

			helper.SendResponse(w, nil, http.StatusOK)
			log.Println("group created successfully")

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
