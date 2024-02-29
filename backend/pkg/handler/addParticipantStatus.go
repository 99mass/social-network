package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

func AddEventParticipantHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			// Extraire l'ID de l'utilisateur de la session
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			var reqPart models.ParticipantRequest
			err = json.NewDecoder(r.Body).Decode(&reqPart)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrect request",
				}, http.StatusBadRequest)
				return
			}

			// Extraire l'ID de l'événement et le statut de participation de la requête
			eventID := r.URL.Query().Get("event_id")
			participantStatus := r.URL.Query().Get("choosen_option")

			// Convertir le statut de participation en int (1 pour Going,   0 pour Not Going)
			var status int
			if participantStatus == "Going" {
				status = 1
			} else {
				status = 0
			}

			reqPart.EvenID = eventID
			reqPart.Option = status

			//userID := r.URL.Query().Get("user_id")

			// Vérifier si l'utilisateur a déjà un statut de participation pour cet événement
			existingStatus, err := controller.GetParticipantStatus(db, reqPart.EvenID, sess.UserID.String())
			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				helper.SendResponseError(w, "error", "Failed to check participation status", http.StatusInternalServerError)
				return
			}

			// Si l'utilisateur a déjà un statut de participation, mettre à jour
			if existingStatus == 0 {
				err = controller.UpdateParticipantStatus(db, reqPart.EvenID, sess.UserID.String(), reqPart.Option)
				if err != nil {
					helper.SendResponseError(w, "error", "Failed to update participation status", http.StatusInternalServerError)
					return
				}
			} else {
				// Sinon, créer une nouvelle participation
				participant := models.EventParticipants{
					EventID: reqPart.EvenID,
					UserID:  sess.UserID.String(),
					Option:  reqPart.Option,
				}
				err = controller.CreateParticipantStatus(db, participant)
				if err != nil {
					helper.SendResponseError(w, "error", "Failed to create participation", http.StatusInternalServerError)
					return
				}
			}

			// Envoyer une réponse de succès
			helper.SendResponse(w, "Participation status updated successfully", http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}
