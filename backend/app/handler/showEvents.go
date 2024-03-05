package handler

import (
	"database/sql"
	"log"
	"net/http"

	"backend/app/controller"
	"backend/app/helper"
	"backend/app/models"
	"backend/app/utils"
	websocket "backend/app/webSocket"
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

			events, err := controller.GetEventsByGroupWithCreatorInfo(db, groupID)
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("we got an issue", err.Error())
				return
			}

			// For each event, determine the user's participation status
			var eventRequests []models.EventRequest
			for _, event := range events {
				participationStatus, err := controller.GetParticipantStatus(db, event.Event.ID, sess.UserID.String())
				if err != nil {
					helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
					log.Println("we got an issue", err.Error())
					return
				}

				// Map the patrticipation status to a string representation
				var status string
				if participationStatus == 1 {
					status = "Going"
				} else {
					status = "Not Going"
				}

				//Get the count of participants who are going
				participantsCountAndDetails, err := controller.GetParticipantsCountAndDetailsByEventID(db, event.Event.ID)
				if err != nil {
					helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
					log.Println("we got an issue", err.Error())
					return
				}

				var goingCount int
				if goingDetails, ok := participantsCountAndDetails[1]; ok {
					goingCount = goingDetails.Count
				}

				// Create an EventRequest for each event
				eventRequest := models.EventRequest{
					Event:               event.Event,
					ParticipationStatus: status,
					GoingCount:          goingCount,
					User:                event.User,
				}

				eventRequests = append(eventRequests, eventRequest)
			}
			controller.DeleteNotificationJoinGroup(db,sess.UserID.String(),groupID,"group_event")
			websocket.BroadcastUserList(db)

			helper.SendResponse(w, eventRequests, http.StatusOK)

		default:
			helper.SendResponseError(w, "error", "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
		}
	}
}

func ListResponseEvents(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			_, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			eventID := r.URL.Query().Get("event_id")
			if eventID == "" {
				helper.SendResponseError(w, "error", "event_id is required", http.StatusBadRequest)
				return
			}

			listgoing, err := controller.GetParticipantsByOption(db, eventID, 1)
			if err != nil {
				log.Println("error getting participants")
				helper.SendResponseError(w, "error", "error getting participants", http.StatusInternalServerError)
				return
			}
			listnotgoing, err := controller.GetParticipantsByOption(db, eventID, 0)
			if err != nil {
				log.Println("error getting participants")
				helper.SendResponseError(w, "error", "error getting participants", http.StatusInternalServerError)
				return
			}
			var participants models.ListParticipantsResponse
			participants.Going = FitEventParticipants(db, listgoing)
			participants.NotGoing = FitEventParticipants(db, listnotgoing)

			helper.SendResponse(w, participants, http.StatusOK)
		default:
			log.Println("Error: Method not allowed")
			helper.SendResponseError(w, "error", "method not allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}

func FitEventParticipants(db *sql.DB, participans []models.EventParticipants) []models.EventParticipants {

	for i, part := range participans {
		userID, _ := utils.TextToUUID(part.UserID)
		user, _ := controller.GetUserByID(db, userID)

		participans[i].UserName = user.FirstName
		if user.AvatarPath != "" {
			img, err := helper.EncodeImageToBase64("./app/static/avatarImage/" + user.AvatarPath)
			if err != nil {
				// participans[i].AvatarPath = "default.png"
				log.Println("enable to encode avatar image", err)
			}
			participans[i].AvatarPath = img
		}
	}
	return participans
}
