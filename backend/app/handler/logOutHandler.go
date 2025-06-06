package handler

import (
	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	websocket "backend/app/webSocket"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gofrs/uuid"
)

func LogOutHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			var lReq sessionReq
			err := json.NewDecoder(r.Body).Decode(&lReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			id, err := uuid.FromString(lReq.SessionID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "invalid value session",
				}, http.StatusBadRequest)
				return
			}
			sess,err := controller.GetSessionByID(db,id)
				if err != nil {
					helper.SendResponse(w, models.ErrorResponse{
						Status:  "error",
						Message: "we got an issue",
					}, http.StatusInternalServerError)
					return
				}
			
			err = controller.DeleteSession(db, id)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusInternalServerError)
				return
			}

			helper.SendResponse(w, nil, http.StatusOK)
			websocket.RemoveUserFromConnectedList(sess.UserID.String())
			websocket.BroadcastUserList(db)
			
		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)

		}
	}
}
