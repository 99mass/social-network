package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"net/http"
)

func ProfilHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			// session := r.Header.Get("Authorization")
			// sessId, err := uuid.FromString(session)
			// if err != nil {
			// 	helper.SendResponse(w, models.ErrorResponse{
			// 		Status:  "error",
			// 		Message: "format value session incorrect",
			// 	}, http.StatusBadRequest)
			// 	return
			// }
			// sess, err := controller.GetSessionByID(db, sessId)
			// if err != nil {
			// 	helper.SendResponse(w, models.ErrorResponse{
			// 		Status:  "error",
			// 		Message: "you're not authorized",
			// 	}, http.StatusBadRequest)
			// 	return
			// }

			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				return
			}
			// check user id format
			userid, err := utils.TextToUUID(r.URL.Query().Get("userid"))
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "you're not authorized",
				}, http.StatusBadRequest)
				return
			}

			// get the user
			user, err := controller.GetUserByID(db, userid)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "user doesn't exist",
				}, http.StatusBadRequest)
				return
			}
			if user.AvatarPath != "" {
				user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
				if err != nil {
					helper.SendResponse(w, models.ErrorResponse{
						Status:  "error",
						Message: "enable to encode image avatar",
					}, http.StatusInternalServerError)
					return
				}
			}
			helper.SendResponse(w, user, http.StatusOK)

		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)
		}
	}
}
