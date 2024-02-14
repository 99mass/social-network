package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/utils"
)

func FollowUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Assurez-vous que l'utilisateur est authentifié et récupérez son ID
		sess, err := utils.CheckAuthorization(db, w, r)
		if err != nil {
			return
		}
		// check user id format
		userid, err := utils.TextToUUID(r.URL.Query().Get("userid"))
		if err != nil {
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodPost:
			// Appelez la fonction de contrôleur pour suivre l'utilisateur
			err = controller.FollowUser(db, sess.UserID.String(), userid.String())
			if err != nil {
				helper.SendResponseError(w, "error", "Error Following user", http.StatusInternalServerError)
				return
			}
			helper.SendResponse(w, nil, http.StatusOK)
		case http.MethodPut:
			// Appelez la fonction de contrôleur pour suivre l'utilisateur
			err = controller.AccepRequestFollow(db, userid.String(), sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "Error Following user", http.StatusInternalServerError)
				return
			}
			helper.SendResponse(w, nil, http.StatusOK)
		case http.MethodDelete:
			// Appelez la fonction de contrôleur pour supprimer le follow
			err = controller.Decline(db, userid.String(), sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "Error Following user", http.StatusInternalServerError)
				return
			}
			helper.SendResponse(w, nil, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("method not allowed")
		}
	}
}

func RequestFollowsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				return
			}

			followers, err := controller.GetRequestFollower(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "can't load followers", http.StatusBadRequest)
				return
			}
			helper.SendResponse(w, followers, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
