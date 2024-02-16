package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

type CommentRequest struct {
	PostID string `json:"postid"`
}

type Comment struct {
	Comment models.Comment
	User    models.User
}

func ShowCommentsByPost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			var comReq CommentRequest
			err = json.NewDecoder(r.Body).Decode(&comReq)
			if err != nil {
				helper.SendResponseError(w, "error", "incorrect Request", http.StatusBadRequest)
				return
			}

			comment, err := controller.GetCommentsByPostID(db, comReq.PostID)
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				return
			}

			var Comments []Comment
			for _, com := range comment {
				var Comment Comment

				//for each com
				if com.ImagePath != "" {
					img, err := helper.EncodeImageToBase64("./pkg/static/commentImage/" + com.ImagePath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image com", http.StatusInternalServerError)
						return
					}
					com.ImagePath = img
				}
				// Get the com creator
				userid, err := utils.TextToUUID(com.UserID)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusBadRequest)
					return
				}
				user, err := controller.GetUserByID(db, userid)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusBadRequest)
					return
				}
				Comment.Comment = com
				if user.AvatarPath != "" {
					user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
						return
					}
				}
				Comment.User = user
				Comments = append(Comments, Comment)
			}
			
			helper.SendResponse(w, Comments, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not Allowed", http.StatusMethodNotAllowed)
		}
	}
}
