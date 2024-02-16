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

func ShowCommentsByPost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			var Comments []models.Comment_Request
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			postID := r.URL.Query().Get("post_id")
			// check user id format

			comments, err := controller.GetCommentsByPostID(db, postID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusBadRequest)
				log.Println("we got an issue : ", err.Error())
				return
			}
			for _, comment := range comments {
				var Comment models.Comment_Request

				if comment.ImagePath != "" {
					img, err := helper.EncodeImageToBase64("./pkg/static/commentImage/" + comment.ImagePath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image comment", http.StatusInternalServerError)
						return
					}
					comment.ImagePath = img
				}
				Comment.Comment = comment

				Comments = append(Comments, Comment)

			}

			helper.SendResponse(w, Comments, http.StatusOK)
		default:

			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
