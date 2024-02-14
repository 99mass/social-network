package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

func UserPosts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			// check user id format
			userID := r.URL.Query().Get("user_id")

			post, err := controller.GetPostsByUserID(db, userID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusBadRequest)
				log.Println("we got an issue : ", err.Error())
				return
			}
			for i, p := range post {
				if p.ImagePath != "" {
					img, err := helper.EncodeImageToBase64("./pkg/static/postImage/" + p.ImagePath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image post", http.StatusInternalServerError)
						return
					}
					post[i].ImagePath = img
				}
			}

			helper.SendResponse(w, post, http.StatusOK)
		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
