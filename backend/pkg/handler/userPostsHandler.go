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
			var Posts []models.Post_Request
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			userID := r.URL.Query().Get("user_id")
			// check user id format

			posts, err := controller.GetPostsByUserID(db, userID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusBadRequest)
				log.Println("we got an issue : ", err.Error())
				return
			}
			for _, post := range posts {
				var Post models.Post_Request

				if post.ImagePath != "" {
					img, err := helper.EncodeImageToBase64("./pkg/static/postImage/" + post.ImagePath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image post", http.StatusInternalServerError)
						return
					}
					post.ImagePath = img
				}
				// Get the post creator
				userid, err := utils.TextToUUID(post.UserID)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusBadRequest)
					return
				}
				user, err := controller.GetUserByID(db, userid)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusBadRequest)
					return
				}
				Post.Post = post
				if user.AvatarPath != "" {
					user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
						return
					}
				}
				Post.User = user
				Posts = append(Posts, Post)
			}

			helper.SendResponse(w, Posts, http.StatusOK)
		default:

			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
