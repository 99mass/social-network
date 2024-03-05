package handler

import (
	"backend/app/controller"
	"backend/app/helper"
	"backend/app/utils"
	"database/sql"
	"log"
	"net/http"
)

func GetUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//log.Println("start")
		switch r.Method {
		case http.MethodGet:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				log.Println("not auth")
				return
			}
			// check user id format
			userid, err := utils.TextToUUID(r.URL.Query().Get("userid"))
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			// get the user
			users, err := controller.GetMyFriends(db, userid)
			//fmt.Println("users", users)
			if err != nil {
				helper.SendResponseError(w, "error", "user doesn't exist", http.StatusBadRequest)
				log.Println("err:", err)
				return
			}
			for i, user := range users {
				if user.AvatarPath != "" {
					users[i].AvatarPath, err = helper.EncodeImageToBase64("./app/static/avatarImage/" + user.AvatarPath)
					if err != nil {
						log.Println("enable to encode image avatar", err.Error())

					}
				}

			}
			helper.SendResponse(w, users, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
