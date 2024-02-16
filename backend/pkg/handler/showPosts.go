package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"log"
	"net/http"
	"strings"
)

func ShowPosts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			var Posts []models.Post_Request
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				log.Println("not authorized", err)
				return
			}
			posts, err := controller.PostToShow(db, sess.UserID.String())
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("we got an issue : ", err.Error())
				return
			}
			for _, post := range posts {
				var Post models.Post_Request

				//for each post
				if post.ImagePath != "" {
					img, err := helper.EncodeImageToBase64("./pkg/static/postImage/" + post.ImagePath)
					if err != nil {
						helper.SendResponseError(w, "error", "enable to encode image post", http.StatusInternalServerError)
						log.Println("enable to encode post image")
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
				if strings.TrimSpace(user.AvatarPath) != "" {
					user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
					if err != nil {
						// helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
						log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
						// return
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
