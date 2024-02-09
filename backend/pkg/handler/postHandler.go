package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gofrs/uuid"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

type PostRequest struct {
	UserID    string `json:"user_id"`
	GroupID   string `json:"group_id"`
	Content   string `json:"content"`
	ImagePath string `json:"image_path"`
	Privacy   string `json:"privacy"`
}

func PostHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			session := r.Header.Get("Authorization")
			sessId, err := uuid.FromString(session)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "format value session incorrect",
				}, http.StatusBadRequest)
				return
			}
			sess, err := controller.GetSessionByID(db, sessId)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "you're not authorized",
				}, http.StatusBadRequest)
				return
			}
			user, err := controller.GetUserByID(db, sess.UserID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "you're not authorized",
				}, http.StatusBadRequest)
				return
			}
			var postReq PostRequest
			_err := json.NewDecoder(r.Body).Decode(&postReq)
			if _err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}

			dir := "./pkg/static/postImage/"
			postImage, _err := utils.ReadAndSaveImage(postReq.ImagePath, dir)
			if _err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: _err.Error(),
				}, http.StatusBadRequest)
				return
			}

			post := models.Post{
				UserID:    user.ID,
				GroupID:   postReq.GroupID,
				Content:   postReq.Content,
				ImagePath: postImage,
				Privacy:   postReq.Privacy,
			}
			result, err := controller.CreatePost(db, post)
			if err != nil {
				log.Println("Unable to create the post: ", err)
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Unable to create the post",
				}, http.StatusInternalServerError)
				return
			}
			log.Println("post created successfully", result)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
