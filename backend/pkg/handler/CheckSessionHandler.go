package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gofrs/uuid"
)

type sessionReq struct {
	SessionID string `json:"sessionID"`
}

func CheckSessionHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {
		case http.MethodPost:
			var sessReq sessionReq

			err := json.NewDecoder(r.Body).Decode(&sessReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}
			id, err := uuid.FromString(sessReq.SessionID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "format session value incorrect",
				}, http.StatusBadRequest)
				return
			}
			session, err := controller.GetSessionByID(db, id)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "invalide session or expired",
				}, http.StatusBadRequest)
				return
			}

			err = controller.UpdateSessionExpiryTime(db, session.ID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusInternalServerError)
				return
			}

			newSession, err := controller.GetSessionByID(db, session.ID)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "we got an issue",
				}, http.StatusInternalServerError)
				return
			}
			helper.SendResponse(w, models.SessionToSend{
				Value:      newSession.ID,
				Expiration: newSession.ExpiresAt,
			}, http.StatusOK)
		default:
			helper.SendResponse(w, models.ErrorResponse{
				Status:  "error",
				Message: "Method not allowed",
			}, http.StatusMethodNotAllowed)

		}
	}
}
