package handler

import (
	"backend/app/controller"
	"backend/app/helper"
	"backend/app/utils"
	"database/sql"
	"log"
	"net/http"
)

func PrivateChatHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			// check user id format
			userid, err := utils.TextToUUID(r.URL.Query().Get("userid"))
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			// get the user
			user, err := controller.GetUserByID(db, userid)
			if err != nil {
				helper.SendResponseError(w, "error", "user doesn't exist", http.StatusBadRequest)
				return
			}
			if user.AvatarPath != "" {
				user.AvatarPath, err = helper.EncodeImageToBase64("./app/static/avatarImage/" + user.AvatarPath)
				if err != nil {
					log.Println("enable to encode image avatar", err.Error())
				}
			}
			helper.SendResponse(w, user, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
