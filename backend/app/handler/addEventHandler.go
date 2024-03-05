package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
	websocket "backend/app/webSocket"
)

type GroupEnventRequest struct {
	GroupID       string `json:"group_id"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	DayTime       string `json:"day_time"`
	CreatedBy     string `json:"created_by"`
	Choose_option string `json:"choose_option"`
}

func AddGroupEventHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			sess, err := utils.CheckAuthorization(db, w, r)
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
			if len(eventReq.Title) > 50 {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "title can't exceed 50 character",
				}, http.StatusBadRequest)
				return
			}

			// Truncate the comment content to   150 characters
			truncatedDescription, err := utils.TruncateCommentContent(eventReq.Description)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "description can't exceed 150 character",
				}, http.StatusBadRequest)
				return
			}
			eventReq.Description = truncatedDescription
			eventReq.Description = strings.TrimSpace(eventReq.Description)
			eventReq.DayTime = strings.TrimSpace(eventReq.DayTime)

			// Parse the event date and time
			eventTime, err := time.Parse("02-01-2006  15:04", eventReq.DayTime)
			if err != nil {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Invalid date and time format",
				}, http.StatusBadRequest)
				return
			}

			// Check if the event date is in the future
			if eventTime.Before(time.Now()) {
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Event date cannot be in the past",
				}, http.StatusBadRequest)
				return
			}

			event := models.GroupEvent{
				GroupID:     eventReq.GroupID,
				Title:       eventReq.Title,
				Description: eventReq.Description,
				DayTime:     eventReq.DayTime,
				CreatedBy:   sess.UserID.String(),
			}

			// Create the group event
			eventID, err := controller.CreateGroupEvent(db, event)
			if err != nil {
				log.Println("Unable to create the group event: ", err)
				helper.SendResponse(w, models.ErrorResponse{
					Status:  "error",
					Message: "Unable to create the group event",
				}, http.StatusInternalServerError)
				return
			}
			var status int
			if eventReq.Choose_option == "1" {
				status = 1
			} else {
				status = 0
			}

			participant := models.EventParticipants{
				EventID: eventID.String(),
				UserID:  sess.UserID.String(),
				Option:  status,
			}
			err = controller.CreateParticipantStatus(db, participant)
			if err != nil {
				log.Printf("Error creating participation: %v\n", err)
				helper.SendResponseError(w, "error", "Failed to create participation", http.StatusInternalServerError)
				return
			}

			websocket.NotificationGroupEvent(db, sess.UserID.String(), event.GroupID)
			websocket.BroadcastUserList(db)
			helper.SendResponse(w, nil, http.StatusOK)
			log.Println("group event created successfully")

		default:
			helper.SendResponseError(w, "error", "mrethod not allowed", http.StatusMethodNotAllowed)
			log.Println("methods not allowed")
		}
	}
}
