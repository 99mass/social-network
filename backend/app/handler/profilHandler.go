package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
)

type ProfilToSend struct {
	User       models.User `json:"user"`
	IsOwner    bool        `json:"isowner"`
	IsFriend   bool        `json:"isfriend"`
	IsFollowed string      `json:"isffollowed"`
}

func ProfilHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
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

			isfollowed, err := controller.IsFollowed(db, sess.UserID.String(), user.ID)
			if err != nil {
				helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
				log.Println("error checking if the user is followed:", err.Error())
				return
			}
			var profil ProfilToSend
			if sess.UserID == userid {
				profil.User = user
				profil.IsOwner = true
				profil.IsFollowed = isfollowed
				helper.SendResponse(w, profil, http.StatusOK)
			} else {
				if !user.IsPublic {
					ok, err := controller.AreUsersFriends(db, sess.UserID.String(), userid.String())
					if err != nil {
						log.Println("you're not able to see this user profile")
						helper.SendResponseError(w, "error", "you're not able to see this user profile", http.StatusBadRequest)
						return
					}
					if ok {
						profil.User = user
						profil.IsOwner = false
						profil.IsFriend = true
						profil.IsFollowed = isfollowed
						helper.SendResponse(w, profil, http.StatusOK)
					} else {
						profil.User = user
						profil.IsOwner = false
						profil.IsFriend = false
						profil.IsFollowed = isfollowed
						helper.SendResponse(w, profil, http.StatusOK)
					}
				} else {
					profil.User = user
					profil.IsOwner = false
					profil.IsFriend = false
					profil.IsFollowed = isfollowed
					helper.SendResponse(w, profil, http.StatusOK)
				}

			}

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
