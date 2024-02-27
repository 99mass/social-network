package handler

import (
	"database/sql"
	"errors"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

func AddEventParticipantHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Extraire l'ID de l'événement et le statut de participation de la requête
		eventID := r.URL.Query().Get("event_id")
		participantStatus := r.URL.Query().Get("chosen_option")

		// Convertir le statut de participation en int (1 pour Going,   0 pour Not Going)
		var status int
		if participantStatus == "Going" {
			status = 1
		} else {
			status = 0
		}

		// Extraire l'ID de l'utilisateur de la session
		sess, err := utils.CheckAuthorization(db, w, r)
		if err != nil {
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
			return
		}
		userID := sess.UserID.String()

		// Vérifier si l'utilisateur a déjà un statut de participation pour cet événement
		existingStatus, err := controller.GetParticipantStatus(db, eventID, userID)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			helper.SendResponseError(w, "error", "Failed to check participation status", http.StatusInternalServerError)
			return
		}

		// Si l'utilisateur a déjà un statut de participation, mettre à jour
		if existingStatus != 0 {
			err = controller.UpdateParticipantStatus(db, eventID, userID, status)
			if err != nil {
				helper.SendResponseError(w, "error", "Failed to update participation status", http.StatusInternalServerError)
				return
			}
		} else {
			// Sinon, créer une nouvelle participation
			participant := models.EventParticipants{
				EventID: eventID,
				UserID:  userID,
				Option:  status,
			}
			err = controller.CreateParticipantStatus(db, participant)
			if err != nil {
				helper.SendResponseError(w, "error", "Failed to create participation", http.StatusInternalServerError)
				return
			}
		}

		// Envoyer une réponse de succès
		helper.SendResponse(w, "Participation status updated successfully", http.StatusOK)
	}
}
