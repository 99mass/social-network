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

type LikeRequest struct {
	PostID string `json:"post_id"`
	Action string `json:"action"` // "like" ou "dislike"
}

type LikeResponse struct {
	User      models.User `json:"user"`
	Status    string      `json:"status"`
	Message   string      `json:"message"`
}

// LikePostHandler gère la requête pour ajouter un like.
func LikePostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:

			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			var req LikeRequest

			err = json.NewDecoder(r.Body).Decode(&req)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}

			var errAction error
			var actionMessage string

			if req.Action == "like" {
				errAction = controller.LikePost(db, sess.UserID.String(), req.PostID)
				actionMessage = "liked"
			} else if req.Action == "dislike" {
				errAction = controller.DislikePost(db, sess.UserID.String(), req.PostID)
				actionMessage = "disliked"
			} else {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Invalid action",
				}, http.StatusBadRequest)
				return
			}

			if errAction != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: errAction.Error(),
				}, http.StatusInternalServerError)
				return
			}

			// Récupérer les informations de l'utilisateur qui a effectué l'action
			user, err := controller.GetUserByID(db, sess.UserID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Unable to fetch user data",
				}, http.StatusInternalServerError)
				return
			}
			if user.AvatarPath != "" {
				user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
				if err != nil {
					log.Println("enable to encode avatar image", err.Error(), "\n avatarPath", user.FirstName)
				}
			}

			response := LikeResponse{
				User:    user,
				Status:  "success",
				Message: "Post " + actionMessage + " successfully",
			}

			helper.SendResponse(w, response, http.StatusOK)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
		}
	}
}
