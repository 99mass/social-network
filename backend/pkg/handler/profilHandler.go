package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/utils"
	"database/sql"
	"net/http"
)

func ProfilHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error","you're not authorized",http.StatusBadRequest)
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
				user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
				if err != nil {
					helper.SendResponseError(w, "error", "enable to encode image avatar", http.StatusInternalServerError)
					return
				}
			}
			helper.SendResponse(w, user, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
