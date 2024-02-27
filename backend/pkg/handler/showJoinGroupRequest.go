package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gofrs/uuid"
)

func ShowJoinGroupRequest(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
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
			fmt.Println(sess)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "you're not authorized",
				}, http.StatusBadRequest)
				return
			}
			groupeID := r.URL.Query().Get("groupid")

			_, err = controller.GetGroupByID(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "this group doesn't exit", http.StatusBadRequest)
				log.Println("the user try to add member in a group that doesn't exist")
				return
			}

			userJoingroupInf, err := controller.GetGroupJoinRequestsInfo(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "Don't Get group request info", http.StatusBadRequest)
				log.Println("join group problem")
				return
			}
			for i := 0; i < len(userJoingroupInf); i++ {

				if userJoingroupInf[i].UserAvartaPath != "" {
					encdeImg, err := helper.EncodeImageToBase64("./pkg/static/avatarImage/" + userJoingroupInf[i].UserAvartaPath)
					if err != nil {
						log.Println("enable to encode avatar image for group")
					}
					userJoingroupInf[i].UserAvartaPath = encdeImg
				}

			}

			helper.SendResponse(w, userJoingroupInf, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
		}

	}
}
