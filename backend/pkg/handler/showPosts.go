package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"log"
	"net/http"
)

type Post struct {
	Post models.Post
	User models.User
}

func ShowPosts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			var Posts []Post
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			posts, err := controller.PostToShow(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("we got an issue : ", err.Error())
				return
			}
			for _, post := range posts {
				var Post Post

				//for each post
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
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
