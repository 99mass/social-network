package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

type GroupEnventRequest struct {
	GroupID     string `json:"group_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func AddGroupEventHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			// Validate and save group event information
			var eventReq GroupEnventRequest
			err = json.NewDecoder(r.Body).Decode(&eventReq)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "incorrectb request",
				}, http.StatusBadRequest)
				return
			}

			eventReq.Title = strings.TrimSpace(eventReq.Title)
			eventReq.Description = strings.TrimSpace(eventReq.Description)

			event := models.GroupEvent{
				GroupID:     eventReq.GroupID,
				Title:       eventReq.Title,
				Description: eventReq.Description,
			}

			// Create the group event
			_, err = controller.CreateGroupEvent(db, event)
			if err != nil {
				log.Println("Unable to create the group event: ", err)
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "YUnable to create the group event",
				}, http.StatusInternalServerError)
				return
			}

			helper.SendResponse(w, nil, http.StatusOK)
			log.Println("group event created successfully")

		default:
			helper.SendResponseError(w, "error", "mrethod not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
