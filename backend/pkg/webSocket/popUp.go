package websocket

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var PopUpUsersList map[string]*models.UserConnected = make(map[string]*models.UserConnected)

func PopupHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessid, err := utils.TextToUUID(r.URL.Query().Get("Authorization"))
		if err != nil {
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
			return
		}
		sess, err := controller.GetSessionByID(db, sessid)
		if err != nil {
			helper.SendResponseError(w, "error", "invalid session", http.StatusBadRequest)
			return
		}
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println(err)
			return
		}

		if user, ok := PopUpUsersList[sess.UserID.String()]; ok {
			// Si l'utilisateur existe déjà, mettez à jour la connexion
			user.Conn = conn
		} else {
			// Sinon, créez un nouvel utilisateur
			ConnectedUsersList[sess.UserID.String()] = &models.UserConnected{Conn: conn, UserID: sess.UserID.String()}
		}
	}
}

func PopupSocket(db *sql.DB) {
	for _, user := range PopUpUsersList {
		if user.Conn != nil {
			// id, _ := uuid.FromString(user.UserID)
			// usersList, err := controller.GetMyFriends(db, id)
			// if err != nil {
			// 	SendGenResponse("error", user.Conn, "this user doesn't exit")
			// 	log.Println("err:", err)
			// 	return
			// }
			// for i, user := range usersList {
			// 	if _, ok := ConnectedUsersList[user.ID]; ok {
			// 		usersList[i].IsOnline = true

			// 	}
			// 	if user.AvatarPath != "" {
			// 		usersList[i].AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
			// 		if err != nil {
			// 			log.Println("enable to encode image avatar", err.Error())
			// 		}
			// 	}

			// }

			nbrMessage, _ := controller.GetNotificationCountByType(db, user.UserID, "private_message")
			SendGenResponse("nbr_notif_message", user.Conn, nbrMessage)
			detailMessage, _ := controller.GetNotificationCountByTypeAndSenderID(db, user.UserID, "private_message")
			SendGenResponse("nbr_notif_message_by_user", user.Conn, detailMessage)
			nbrFollow, _ := controller.GetNotificationCountByType(db, user.UserID, "follow_request")
			SendGenResponse("nbr_notif_follow", user.Conn, nbrFollow)
			nbrJoinReq, _ := controller.GetNotificationCountByTypeAndSourceID(db, user.UserID, "join_group")
			SendGenResponse("nbr_notif_join_group_request", user.Conn, nbrJoinReq)
			var res int
			for _, v := range nbrJoinReq {
				res += v.CountJoinReq
			}
			nbrGrpJoinReq, _ := controller.GetNotificationCountByType(db, user.UserID, "group_invitation")
			SendGenResponse("nbr_notif_group_invitation", user.Conn, nbrGrpJoinReq)

			nbrChatGrp, _ := controller.GetNotificationCountByTypeAndSourceID(db, user.UserID, "chat_group")
			SendGenResponse("nbr_notif_chat_group", user.Conn, nbrChatGrp)

			SendGenResponse("total_group_notif", user.Conn, res+nbrGrpJoinReq+len(nbrChatGrp))

			// err = SendGenResponse("users_list", user.Conn, usersList)
			// if err != nil {
			// 	// Handle the error (e.g., log it, remove the user from the map, etc.)
			// 	RemoveUserFromConnectedList(user.UserID)
			// 	log.Printf("Failed to send message to user %s: %v", user.UserID, err)
			// }
		}
	}
}
