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
	GroupID        string   `json:"group_id"`
	Content        string   `json:"content"`
	ImagePath      string   `json:"image_path"`
	Privacy        string   `json:"privacy"`
	Authorize_User []string `json:"authorize_user"`
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
			var postReq PostRequest
			_err := json.NewDecoder(r.Body).Decode(&postReq)
			if _err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			if postReq.Privacy != "public" && postReq.Privacy != "private" && postReq.Privacy != "almost" {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "given value incorrect",
				}, http.StatusBadRequest)
				return
			}

			if postReq.Privacy == "almost" && postReq.Authorize_User == nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "you must take at least one user for almost",
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
				UserID:    sess.UserID.String(),
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
			if post.Privacy == "almost" && postReq.Authorize_User != nil {
				for _, alm := range postReq.Authorize_User {
					var almost models.Almost_Users
					almost.Post_id = result.String()
					almost.User_id = sess.UserID.String()
					almost.Authorize_User = alm
					//TODO : create almost user
					err := controller.CreateAlmostUser(db, &almost)
					if err != nil {
						helper.SendResponse(w, models.ErrorResponse{
							Status:  "error",
							Message: "we got an issue",
						}, http.StatusInternalServerError)
						log.Println("internal ERROR from database: ", err.Error())
						return
					}
				}

			}
			helper.SendResponse(w, nil, http.StatusOK)
			log.Println("post created successfully")

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
