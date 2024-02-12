package handler

import (
	"database/sql"
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
		// Appelez la fonction de contrôleur pour suivre l'utilisateur
		err = controller.FollowUser(db, sess.UserID, userid)
		if err != nil {
			helper.SendResponseError(w, "error", "Error Following user", http.StatusInternalServerError)
			return
		}

		// Répondez avec succès
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "success"}`))
	}
}
