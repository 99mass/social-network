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
						helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
						log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
						return
					}
				}
				Post.User = user
				// Check if the user is followed
				isfollowed, _ := controller.IsFollowed(db, sess.UserID.String(), user.ID)
				Post.IsFollowed = isfollowed
				log.Println("isfollowed", isfollowed)

				nbrLikes, _ := controller.CountPostLikes(db, post.ID)
				nbrComments, _ := controller.CountCommentsByPostID(db, post.ID)

				Post.NbrLikes = nbrLikes
				Post.NbrComments = nbrComments

				Posts = append(Posts, Post)
			}

			helper.SendResponse(w, Posts, http.StatusOK)

		case http.MethodPost:

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
			postID := r.URL.Query().Get("post_id")
			var postToShow models.Post_Request
			var count int
			for _, post := range posts {
				if post.ID == postID {
					count = 1
					if post.ImagePath != "" {
						img, err := helper.EncodeImageToBase64("./pkg/static/postImage/" + post.ImagePath)
						if err != nil {
							helper.SendResponseError(w, "error", "enable to encode image post", http.StatusInternalServerError)
							return
						}
						post.ImagePath = img
					}
					postToShow.Post = post
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
					if user.AvatarPath != "" {
						user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
						if err != nil {
							helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
							return
						}
					}
					postToShow.User = user
					nbrLikes, _ := controller.CountPostLikes(db, post.ID)
					nbrComments, _ := controller.CountCommentsByPostID(db, post.ID)

					postToShow.NbrLikes = nbrLikes
					postToShow.NbrComments = nbrComments
				}
			}
			if count != 1 {
				helper.SendResponseError(w, "error", "you're not able to see this post", http.StatusBadRequest)
				log.Println("you're not able to see this post")
				return
			}
			helper.SendResponse(w, postToShow, http.StatusOK)

		default:

			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
