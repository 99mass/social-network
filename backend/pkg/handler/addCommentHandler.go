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

type RequestComment struct {
	UserID string `json:"user_id"`
	PostID    string `json:"post_id"`
	Content   string `json:"content"`
	ImagePath string `json:"image_path"`
}

func AddCommentHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			var reqComment RequestComment
			err = json.NewDecoder(r.Body).Decode(&reqComment)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			
			// Truncate the comment content to   150 characters
			truncatedContent, err := utils.TruncateCommentContent(reqComment.Content)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}
			reqComment.Content = truncatedContent

			dir := "./pkg/static/commentImage/"
			commentImage, _err := utils.ReadAndSaveImage(reqComment.ImagePath, dir)
			if _err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: _err.Error(),
				}, http.StatusBadRequest)
				return
			}

			comment := models.Comment{
				UserID:    sess.UserID.String(),
				PostID:    reqComment.PostID,
				Content:   reqComment.Content,
				ImagePath: commentImage,
			}

			newUUID, err := controller.CreateComment(db, comment)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Unable to add comment",
				}, http.StatusInternalServerError)
				return
			}

			helper.SendResponse(w, map[string]interface{}{
				"status":     "success",
				"message":    "Comment added successfully",
				"comment_id": newUUID.String(),
			}, http.StatusOK)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
