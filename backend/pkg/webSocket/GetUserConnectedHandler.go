package websocket

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"database/sql"
	"log"

	"github.com/gofrs/uuid"
)

// BroadcastMessage sends a message to all connected users.
func BroadcastUserList(db *sql.DB) {
	for _, user := range ConnectedUsersList {
		if user.Conn != nil {
			id, _ := uuid.FromString(user.UserID)
			usersList, err := controller.GetMyFriends(db, id)
			if err != nil {
				SendGenResponse("error", user.Conn, "this user doesn't exit")
				log.Println("err:", err)
				return
			}
			for i, user := range usersList {
				if _, ok := ConnectedUsersList[user.ID]; ok {
					usersList[i].IsOnline = true

				}
				if user.AvatarPath != "" {
					usersList[i].AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
					if err != nil {
						log.Println("enable to encode image avatar", err.Error())
					}
				}

			}

			nbrMessage, _ := controller.GetNotificationCountByType(db, user.UserID, "private_message")
			SendGenResponse("nbr_notif_message", user.Conn, nbrMessage)
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
			SendGenResponse("total_group_notif", user.Conn, res+nbrGrpJoinReq)
			nbrChatGrp, _ := controller.GetNotificationCountByTypeAndSourceID(db, user.UserID, "chat_group")
			SendGenResponse("nbr_notif_chat_group", user.Conn, nbrChatGrp)

			err = SendGenResponse("users_list", user.Conn, usersList)
			if err != nil {
				// Handle the error (e.g., log it, remove the user from the map, etc.)
				RemoveUserFromConnectedList(user.UserID)
				log.Printf("Failed to send message to user %s: %v", user.UserID, err)
			}
		}
	}
}

func RemoveUserFromConnectedList(userID string) {
	// Assuming ConnectedUsersList is a global variable or accessible in this scope
	delete(ConnectedUsersList, userID)
}
