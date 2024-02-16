package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

type LikeRequest struct {
	UserID string `json:"user_id"`
	PostID string `json:"post_id"`
}

// LikePostHandler gère la requête pour ajouter un like.
func LikePostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:

			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			var req LikeRequest

			err = json.NewDecoder(r.Body).Decode(&req)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}

			err = controller.LikePost(db, sess.UserID.String(), req.PostID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusInternalServerError)
				return
			}

			helper.SendResponse(w, map[string]interface{}{
				"status":  "success",
				"message": "Post liked successfully",
			}, http.StatusOK)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
		}
	}
}
