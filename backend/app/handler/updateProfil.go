package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gofrs/uuid"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
	websocket "backend/app/webSocket"
)

type UpdateRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	NewPassword string `json:"newpassword"`
	FirstName   string `json:"firstname"`
	LastName    string `json:"lastname"`
	DateOfBirth string `json:"dateofbirth"`
	AvatarPath  string `json:"avatarpath"`
	Nickname    string `json:"nickname"`
	AboutMe     string `json:"aboutme"`
	IsPublic    bool   `json:"ispublic"`
}

func UpdateProfil(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("methode: " + r.Method)
		switch r.Method {
		case http.MethodPut:
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
			var user models.User
			var userReq UpdateRequest
			err = json.NewDecoder(r.Body).Decode(&userReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			log.Println("AboutMe:", userReq.AboutMe)
			checkRegister, err := utils.CheckUpdateFormat(userReq.FirstName, userReq.LastName,
				userReq.Nickname, userReq.Email, userReq.DateOfBirth, sess.UserID, db)

			if !checkRegister {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}

			newPass, err := utils.CheckUpdatePassword(userReq.Password, userReq.NewPassword, sess.UserID, db)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}

			// Récupérer l'ancienne image à partir de la base de données
			oldUser, err := controller.GetUserByID(db, sess.UserID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "failed to get user",
				}, http.StatusInternalServerError)
				return
			}
			oldImage := oldUser.AvatarPath
			oldImagePath := oldImage

			dir := "./app/static/avatarImage/"
			userAvatar, err := utils.ReadAndSaveImageForUpdate(userReq.AvatarPath, dir, oldImagePath)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}
			user.Email = userReq.Email
			user.FirstName = userReq.FirstName
			user.LastName = userReq.LastName
			user.Nickname = userReq.Nickname
			user.DateOfBirth = userReq.DateOfBirth
			user.Password = newPass
			user.AvatarPath = userAvatar
			user.IsPublic = userReq.IsPublic
			user.AboutMe = userReq.AboutMe
			user.ID = sess.UserID.String()

			err = controller.UpdateUser(db, user)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusInternalServerError)
				return
			}
			helper.SendResponse(w, nil, http.StatusOK)
			websocket.BroadcastUserList(db)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
