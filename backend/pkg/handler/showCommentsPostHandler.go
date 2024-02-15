package handler

import (
	"database/sql"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

func ShowCommentsByPost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			postID := r.URL.Query().Get("post_id")

			if postID == "" {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Missing post_id parameter",
				}, http.StatusBadRequest)
				return
			}

			comments, err := controller.GetCommentsByPostID(db, postID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Unable to get comments",
				}, http.StatusInternalServerError)
				return
			}

			helper.SendResponse(w, comments, http.StatusOK)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
		}
	}
}
