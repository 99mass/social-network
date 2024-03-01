package handler

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
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
						user.AvatarPath = "default.png"
						// helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
						log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
						// return
					}
				}
				Post.User = user
				// Check if the user is followed
				isfollowed, err := controller.IsFollowed(db, sess.UserID.String(), user.ID)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
					log.Println("error checking if the user is followed:", err.Error())
					return
				}

				Post.IsFollowed = isfollowed

				// Itère sur chaque post et récupère le statut du like
				isLiked, err := controller.IsPostLikedByUser(db, sess.UserID.String(), post.ID)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
					log.Println("error checking if the post is liked:", err.Error())
					return
				}
				Post.IsLiked = isLiked

				nbrLikes, err := controller.CountPostLikes(db, post.ID)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
					log.Println("error counting post likes:", err.Error())
					return
				}

				nbrComments, err := controller.CountCommentsByPostID(db, post.ID)
				if err != nil {
					helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
					log.Println("error counting comments for the post:", err.Error())
					return
				}

				groupName, avatarPath, err := controller.GetGroupNameByIdPost(db, post.GroupID)
				if err != nil {
					log.Println("error getting group name", err.Error())
					helper.SendResponseError(w, "error", "error getting group name", http.StatusInternalServerError)
					return
				}

				if strings.TrimSpace(avatarPath) != "" {
					Post.GroupAvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + avatarPath)
					if err != nil {
						user.AvatarPath = "default.png"
						// helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
						log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
						// return
					}
				}

				Post.NbrLikes = nbrLikes
				Post.NbrComments = nbrComments
				Post.GroupID = post.GroupID
				Post.GroupName = groupName

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
							log.Println("enable to encode image user", err)

						}
					}
					postToShow.User = user

					// Itère sur chaque post et récupère le statut du like
					isLiked, err := controller.IsPostLikedByUser(db, sess.UserID.String(), post.ID)
					if err != nil {
						helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
						log.Println("error checking if the post is liked:", err.Error())
						return
					}
					postToShow.IsLiked = isLiked

					groupName, avatarPath, err := controller.GetGroupNameByIdPost(db, post.GroupID)
					if err != nil {
						log.Println("error getting group name", err.Error())
						helper.SendResponseError(w, "error", "error getting group name", http.StatusInternalServerError)
						return
					}

					if strings.TrimSpace(avatarPath) != "" {
						postToShow.GroupAvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + avatarPath)
						if err != nil {
							user.AvatarPath = "default.png"
							// helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
							log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
							// return
						}
					}
					postToShow.GroupID = post.GroupID
					postToShow.GroupName = groupName

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
