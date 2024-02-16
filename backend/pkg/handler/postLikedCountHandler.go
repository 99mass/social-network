package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"database/sql"
	"net/http"
)

// GetPostLikesCountHandler gère la requête pour obtenir le nombre de likes d'un post.
func GetPostLikesCountHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			postID := r.URL.Query().Get("post_id")
			if postID == "" {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Missing post_id parameter",
				}, http.StatusBadRequest)
				return
			}

			count, err := controller.GetPostLikesCount(db, postID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusInternalServerError)
				return
			}

			helper.SendResponse(w, map[string]interface{}{
				"status": "success",
				"count":  count,
			}, http.StatusOK)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
		}
	}
}
