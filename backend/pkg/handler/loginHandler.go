package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"main/pkg/helper"
	"main/pkg/models"
	"main/pkg/utils"
	"net/http"
)

type loginReq struct{
	Email string `json:"email"`
	Password string `json:"password"`
}


func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			var logReq loginReq
			err := json.NewDecoder(r.Body).Decode(&logReq)
			if err != nil {
				helper.SendResponse(w,models.ErrorResponse{
					Status: "error",
					Message: "incorrect request",
				},http.StatusBadRequest)
				return
			}
			okLogin,userID,err := utils.CheckLogin(logReq.Email,logReq.Password,db)

			log.Println("is it ok : ",okLogin)
			log.Println("the UserID: ",userID)
			log.Println("the error : ",err)


		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}

}
