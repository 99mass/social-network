package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

func GetEventsByGroupHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			groupID := r.URL.Query().Get("group_id")
			if groupID == "" {
				helper.SendResponseError(w, "error", "group_id is required", http.StatusBadRequest)
				return
			}

			events, err := controller.GetEventsByGroupID(db, groupID)
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("w e got an issue", err.Error())
				return
			}

			// For each event, determine the user's participation status
			var eventRequests []models.EventRequest
			for _, event := range events {
				participationStatus, err := controller.GetParticipantStatus(db, event.ID, sess.UserID.String())
				if err != nil {
					helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
					log.Println("w e got an issue", err.Error())
					return
				}

				// Map the patrticipation status to a string representation
				var status string
				if participationStatus == 1 {
					status = "Going"
				} else {
					status = "Not Going"
				}

				// Create an EventRequest for each event
				eventRequest := models.EventRequest{
					Event:               event,
					ParticipationStatus: status,
				}

				eventRequests = append(eventRequests, eventRequest)
			}

			helper.SendResponse(w, eventRequests, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method mnot allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
		}
	}
}
