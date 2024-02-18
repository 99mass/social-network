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
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
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
			if sess.UserID.String() == userid.String() {
				helper.SendResponseError(w, "error", "You can't follow yourself", http.StatusBadRequest)
				log.Println("You can't follow yourself")
				return
			}
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
				log.Println("erro accepting followrequest:", err)
				helper.SendResponseError(w, "error", "Error Following user", http.StatusInternalServerError)
				return
			}
			helper.SendResponse(w, nil, http.StatusOK)
		case http.MethodDelete:
			// Appelez la fonction de contrôleur pour supprimer le follow
			err = controller.Decline(db, userid.String(), sess.UserID.String())
			if err != nil {
				log.Println("erro delete", err)
				helper.SendResponseError(w, "error", "Error Following user", http.StatusInternalServerError)
				return
			}
			helper.SendResponse(w, nil, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func UnfollowUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Assurez-vous que l'utilisateur est authentifié et récupérez son ID
		log.Println("follow handler:", r.Method)
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
		switch r.Method {
		case http.MethodDelete:
			// Appelez la fonction de contrôleur pour supprimer le follow
			err = controller.Decline(db, sess.UserID.String(), userid.String())
			if err != nil {
				log.Println("erro delete", err)
				helper.SendResponseError(w, "error", "Error Following user", http.StatusInternalServerError)
				return
			}
			log.Println("no error")
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

			followers, err := controller.GetFollowRequestInfos(db, sess.UserID.String())
			if err != nil {
				log.Println("error getfollowers info", err)
				helper.SendResponseError(w, "error", "can't load followers", http.StatusBadRequest)
				return
			}
			for i, follower := range followers {
				if follower.UserAvatarPath != "" {
					followers[i].UserAvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + follower.UserAvatarPath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image avatar", http.StatusInternalServerError)
						return
					}
				}
			}
			helper.SendResponse(w, followers, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func OldestPendingRequestFollow(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				return
			}
			follower, err := controller.GetOldestFollowRequest(db, sess.UserID.String())
			if err != nil {
				if err == sql.ErrNoRows {
					// Si aucune ligne n'est trouvée, retournez une erreur personnalisée ou une valeur par défaut
					return
				}
				log.Println("error getfollowers info", err)
				helper.SendResponseError(w, "error", "can't load followers", http.StatusBadRequest)
				return
			}
			if follower.UserAvatarPath != "" {
				follower.UserAvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + follower.UserAvatarPath)
				if err != nil {
					helper.SendResponseError(w, "error", "enable to encode image avatar", http.StatusInternalServerError)
					return
				}
			}
			helper.SendResponse(w, follower, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}

	}
}

func GetFollowerInfos(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Assurez-vous que l'utilisateur est authentifié et récupérez son ID
		sess, err := utils.CheckAuthorization(db, w, r)
		if err != nil {
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
			return
		}

		switch r.Method {
		case http.MethodGet:
			followers, err := controller.GetFollowerInfos(db, sess.UserID.String())
			if err != nil {
				if err != sql.ErrNoRows {
					log.Println("error getting follower: ", err)
					helper.SendResponseError(w, "error", "wo got an error", http.StatusInternalServerError)
					return
				}
				helper.SendResponse(w, nil, http.StatusOK)
				return
			}
			helper.SendResponse(w, followers, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
func GetFollowingInfos(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Assurez-vous que l'utilisateur est authentifié et récupérez son ID
		sess, err := utils.CheckAuthorization(db, w, r)
		if err != nil {
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
			return
		}

		switch r.Method {
		case http.MethodGet:
			followers, err := controller.GetFollowingInfos(db, sess.UserID.String())
			if err != nil {
				if err != sql.ErrNoRows {
					log.Println("error getting following users: ", err)
					helper.SendResponseError(w, "error", "wo got an error", http.StatusInternalServerError)
					return
				}
				helper.SendResponse(w, nil, http.StatusOK)
				return
			}
			helper.SendResponse(w, followers, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
