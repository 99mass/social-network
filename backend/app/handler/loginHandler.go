package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
	"net/http"
)

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			var logReq loginReq
			err := json.NewDecoder(r.Body).Decode(&logReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			okLogin, userID, err := utils.CheckLogin(logReq.Email, logReq.Password, db)

			if !okLogin {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}

			sessionID, err := helper.AddSession(userID, db)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			session, err := controller.GetSessionByID(db, sessionID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusInternalServerError)
				return
			}
			log.Println("succesfully login")
			helper.SendResponse(w, models.SessionToSend{
				Value:      session.ID,
				Expiration: session.ExpiresAt,
			}, http.StatusOK)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}

}
