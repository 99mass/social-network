package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/utils"
	"database/sql"
	"log"
	"net/http"
	"strings"
)

func ConnectedUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				return
			}

			// get the user
			user, err := controller.GetUserByID(db, sess.UserID)
			if err != nil {
				helper.SendResponseError(w, "error", "user doesn't exist", http.StatusBadRequest)
				return
			}

			if user.AvatarPath != ""  {

				user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + strings.TrimSpace(user.AvatarPath))
				if err != nil {
					log.Println("enable to encode image avatar "+err.Error())
					
				}
			}

			helper.SendResponse(w, user, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
