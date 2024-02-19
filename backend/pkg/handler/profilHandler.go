package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"log"
	"net/http"
)

type ProfilToSend struct {
	User     models.User `json:"user"`
	IsOwner  bool        `json:"isowner"`
	IsFriend bool        `json:"isfriend"`
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
				user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
				if err != nil {
					helper.SendResponseError(w, "error", "enable to encode image avatar", http.StatusInternalServerError)
					return
				}
			}
			var profil ProfilToSend
			if sess.UserID == userid {
				profil.User = user
				profil.IsOwner = true
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
						helper.SendResponse(w, profil, http.StatusOK)
					} else {
						profil.User = user
						profil.IsOwner = false
						profil.IsFriend = false
						helper.SendResponse(w, profil, http.StatusOK)
					}
				} else {
					profil.User = user
					profil.IsOwner = false
					helper.SendResponse(w, profil, http.StatusOK)
				}

			}

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
