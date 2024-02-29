package handler

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/utils"
	websocket "backend/pkg/webSocket"
	"database/sql"
	"log"
	"net/http"
)

func JoingGroupRequest(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("try join group")
		switch r.Method {
		case http.MethodGet:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}
			log.Println("authorization checked")

			groupeID := r.URL.Query().Get("groupid")
			// var invitationReq InvitationRequest
			_, err = controller.GetGroupByID(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "this group doesn't exit", http.StatusBadRequest)
				log.Println("the user try to add member in a group that doesn't exist")
				return
			}
			log.Println("check again")
			err = controller.JoinGroupRequest(db, sess.UserID.String(), groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "enable to join the group", http.StatusBadRequest)
				log.Println("the request invitation can't be accepted due to" + err.Error())
				return
			}
			log.Println("checked")
			creator, err := controller.GetCreatorByGroupID(db, groupeID)
			if err != nil {
				helper.SendResponseError(w, "error", "we got an issue", http.StatusBadRequest)
				log.Println("can't get the creator by the groupID" + err.Error())
				return
			}
			websocket.NotificationJoinGroup(db, sess.UserID.String(), groupeID, creator)
			websocket.BroadcastUserList(db)
			log.Println("Join group request successful")
			helper.SendResponse(w, nil, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "methode not allowed", http.StatusMethodNotAllowed)
			log.Println("the request can't be accepted", r.Method)
		}
	}
}

func AcceptJoinGroupRequestHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			groupeID := r.URL.Query().Get("groupid")
			userID := r.URL.Query().Get("userid")

			iscreator, err := controller.IsUserGroupCreator(db, sess.UserID.String(), groupeID)

			if !iscreator {
				log.Println("Error: Not allowed to accept the join group request")
				helper.SendResponseError(w, "error", "you are not allowed to accept the join group request", http.StatusBadRequest)
				return
			}

			err = controller.AcceptJoinGroupRequest(db, userID, groupeID)
			if err != nil {
				log.Println("Error: accepting join group request failled:", err)
				helper.SendResponseError(w, "error", "something goes wrong", http.StatusBadRequest)
				return
			}

			helper.SendResponse(w, nil, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "methode not allowed", http.StatusMethodNotAllowed)
			log.Println("the request can't be accepted", r.Method)
		}
	}
}

func RejectJoinGroupRequestHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			sess, err := utils.CheckAuthorization(db, w, r)
			if err != nil {
				log.Println("default")
				helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
				return
			}

			groupeID := r.URL.Query().Get("groupid")
			userID := r.URL.Query().Get("userid")
			creator := r.URL.Query().Get("creatorid")
			log.Println("creatorid:", creator)
			if userID != "" {
				iscreator, _ := controller.IsUserGroupCreator(db, sess.UserID.String(), groupeID)

				if !iscreator {
					log.Println("Error: Not allowed to reject the join group request")
					helper.SendResponseError(w, "error", "you are not allowed to accept the join group request", http.StatusBadRequest)
					return
				}

				err = controller.RejectJoinGroupRequest(db, userID, groupeID)
				if err != nil {
					log.Println("Error: rejecting join group request failled:", err)
					helper.SendResponseError(w, "error", "something goes wrong", http.StatusBadRequest)
					return
				}
			} else {
				isJoinRequest, _ := controller.IsJoinRequestSend(db, sess.UserID.String(), groupeID)
				if isJoinRequest {
					err = controller.RejectJoinGroupRequest(db, sess.UserID.String(), groupeID)
					if err != nil {
						log.Println("Error: rejecting join group request failled:", err)
						helper.SendResponseError(w, "error", "something goes wrong", http.StatusBadRequest)
						return
					}
				}
				controller.DeleteNotificationJoinGroupBySender(db, creator, groupeID,sess.UserID.String(), "join_group")
				websocket.BroadcastUserList(db)
			}
			websocket.BroadcastUserList(db)
			helper.SendResponse(w, nil, http.StatusOK)
		default:
			helper.SendResponseError(w, "error", "methode not allowedeeee", http.StatusMethodNotAllowed)
			log.Println("the request can't be accepted", r.Method)
		}
	}
}
