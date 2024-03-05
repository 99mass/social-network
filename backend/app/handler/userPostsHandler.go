package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
)

func UserPosts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			var Posts []models.Post_Request
			sess, err := utils.CheckAuthorization(db, w, r)
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
					img, err := helper.EncodeImageToBase64("./app/static/postImage/" + post.ImagePath)
					if err != nil {
						log.Println("enable to encode image avatar", err.Error())
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
					user.AvatarPath, err = helper.EncodeImageToBase64("./app/static/avatarImage/" + user.AvatarPath)
					if err != nil {
						log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
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

				Post.NbrLikes = nbrLikes
				Post.NbrComments = nbrComments

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
