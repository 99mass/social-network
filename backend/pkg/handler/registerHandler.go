package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type RegisterRequest struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmpassword"`
	FirstName       string `json:"firstname"`
	LastName        string `json:"lastname"`
	DateOfBirth     string `json:"dateofbirth"`
	AvatarPath      string `json:"avatarpath"`
	Nickname        string `json:"nickname"`
	AboutMe         string `json:"aboutme"`
}

func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			var registerReq RegisterRequest
			err := json.NewDecoder(r.Body).Decode(&registerReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}

			registerReq.Nickname = strings.TrimSpace(registerReq.Nickname)

			checkRegister, err := utils.CheckRegisterFormat(registerReq.FirstName, registerReq.LastName, registerReq.Nickname, registerReq.Email, registerReq.Password, registerReq.ConfirmPassword, registerReq.DateOfBirth, db)

			if !checkRegister {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}

			dir := "./pkg/static/avatarImage/"
			userAvatar, err := utils.ReadAndSaveImage(registerReq.AvatarPath, dir)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}

			hashedPassword, err := helper.HashPassword(registerReq.Password)
			if err != nil {
				log.Println("enable to hash the password")
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusInternalServerError)
				return
			}
			user := models.User{
				Email:       registerReq.Email,
				Password:    hashedPassword,
				FirstName:   registerReq.FirstName,
				LastName:    registerReq.LastName,
				DateOfBirth: registerReq.DateOfBirth,
				AvatarPath:  userAvatar,
				Nickname:    registerReq.Nickname,
				AboutMe:     registerReq.AboutMe,
			}

			// TODO : Verify if informations given by the user are correct

			_, err = controller.CreateUser(db, user)
			if err != nil {
				helper.SendResponseError(w, "error", "enable to create the user: ", http.StatusInternalServerError)
				log.Println("enable to create the user: ", err)
				return
			}
			// sessionID, err := helper.AddSession(userID, db)
			// if err != nil {
			// 	helper.SendResponse(w, models.ErrorResponse{
			// 		Status:  "error",
			// 		Message: "incorrect request",
			// 	}, http.StatusBadRequest)
			// 	return
			// }
			// session, err := controller.GetSessionByID(db, sessionID)
			// if err != nil {
			// 	helper.SendResponse(w, models.ErrorResponse{
			// 		Status:  "error",
			// 		Message: "we got an issue",
			// 	}, http.StatusInternalServerError)
			// 	return
			// }
			log.Println("user created succesfully")
			helper.SendResponse(w, nil, http.StatusOK)
		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
