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

func ShowPostsGroup(db *sql.DB) http.HandlerFunc {
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
			postID := r.URL.Query().Get("postid")

			// For one Post of a group
			if postID != "" {
				post, err := controller.GetPostByID(db, postID)
				if err != nil {
					helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
					log.Println("error getting post")
					return
				}
				PostReq, err := FitPostRequest(db, w, post, sess.UserID.String())
				if err != nil {
					return
				}
				helper.SendResponse(w, PostReq, http.StatusOK)
				return
			}
			// For all post of a group
			groupID := r.URL.Query().Get("groupid")
			log.Println("groupid", groupID)
			posts, err := controller.GetPostsGroup(db, groupID)
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("Error geting posts group : ", err.Error())
				return
			}
			for _, post := range posts {

				PostReq, err := FitPostRequest(db, w, post, sess.UserID.String())

				if err != nil {
					return
				}
				Posts = append(Posts, PostReq)
			}
			log.Println("Posts group sent successfully")
			helper.SendResponse(w, Posts, http.StatusOK)

		default:

			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}

// Fit the post request models through the post.
func FitPostRequest(db *sql.DB, w http.ResponseWriter, post models.Post, ConnecteduseriID string) (models.Post_Request, error) {
	var PostReq models.Post_Request

	//for each post
	if post.ImagePath != "" {
		img, err := helper.EncodeImageToBase64("./pkg/static/postImage/" + post.ImagePath)
		if err != nil {
			helper.SendResponseError(w, "error", "enable to encode image post", http.StatusInternalServerError)
			log.Println("enable to encode post image")
			return models.Post_Request{}, err
		}
		post.ImagePath = img
	}
	// Get the post creator
	userid, err := utils.TextToUUID(post.UserID)
	if err != nil {
		helper.SendResponseError(w, "error", err.Error(), http.StatusBadRequest)
		return models.Post_Request{}, err
	}
	user, err := controller.GetUserByID(db, userid)
	if err != nil {
		helper.SendResponseError(w, "error", err.Error(), http.StatusBadRequest)
		return models.Post_Request{}, err
	}
	PostReq.Post = post
	if strings.TrimSpace(user.AvatarPath) != "" {
		user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
		if err != nil {
			user.AvatarPath = "default.png"
			// helper.SendResponseError(w, "error", "enable to encode image user", http.StatusInternalServerError)
			log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
			// return
		}
	}
	PostReq.User = user
	// Check if the user is followed
	isfollowed, err := controller.IsFollowed(db, ConnecteduseriID, user.ID)
	if err != nil {
		helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
		log.Println("error checking if the user is followed:", err.Error())
		return models.Post_Request{}, err
	}

	PostReq.IsFollowed = isfollowed

	// Itère sur chaque post et récupère le statut du like
	isLiked, err := controller.IsPostLikedByUser(db, ConnecteduseriID, post.ID)
	if err != nil {
		helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
		log.Println("error checking if the post is liked:", err.Error())
		return models.Post_Request{}, err
	}
	PostReq.IsLiked = isLiked

	nbrLikes, err := controller.CountPostLikes(db, post.ID)
	if err != nil {
		helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
		log.Println("error counting post likes:", err.Error())
		return models.Post_Request{}, err
	}

	nbrComments, err := controller.CountCommentsByPostID(db, post.ID)
	if err != nil {
		helper.SendResponseError(w, "error", err.Error(), http.StatusInternalServerError)
		log.Println("error counting comments for the post:", err.Error())
		return models.Post_Request{}, err
	}

	PostReq.NbrLikes = nbrLikes
	PostReq.NbrComments = nbrComments

	return PostReq, nil
}
