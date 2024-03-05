package handler

import (
	"database/sql"
	"errors"
	"log"
	"net/http"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
)

func AddEventParticipantHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			// Assurez-vous que l'utilisateur est authentifié et récupérez son ID
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			// Extraire l'ID de l'événement et le statut de participation de la requête
			eventID := r.URL.Query().Get("event_id")
			participantStatus := r.URL.Query().Get("choosen_option")
			if eventID == "" {
				return
			}
			// Convertir le statut de participation en int (1 pour Going,   0 pour Not Going)
			var status int
			if participantStatus == "1" {
				status = 1
			} else {
				status = 0
			}

			// Vérifier si l'utilisateur a déjà un statut de participation pour cet événement
			existingStatus, err := controller.GetParticipantStatus(db, eventID, sess.UserID.String())
			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				log.Printf("Error checking participation status: %v\n", err)
				helper.SendResponseError(w, "error", "Failed to check participation status", http.StatusInternalServerError)
				return
			}

			// Si l'utilisateur a déjà un statut de participation, mettre à jour
			if existingStatus != 2 {
				err = controller.UpdateParticipantStatus(db, eventID, sess.UserID.String(), status)
				if err != nil {
					log.Printf("Error updating participation status: %v\n", err)
					helper.SendResponseError(w, "error", "Failed to update participation status", http.StatusInternalServerError)
					return
				}
			} else {
				// Sinon, créer une nouvelle participation
				participant := models.EventParticipants{
					EventID: eventID,
					UserID:  sess.UserID.String(),
					Option:  status,
				}
				err = controller.CreateParticipantStatus(db, participant)
				if err != nil {
					log.Printf("Error creating participation: %v\n", err)
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
