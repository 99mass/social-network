package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/utils"
)

func RecentDiscussionsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			discussions, err := controller.GetRecentDiscussions(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("we got an issue", err.Error())
				return
			}

			helper.SendResponse(w, discussions, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
		}
	}
}
