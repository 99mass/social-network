package websocket

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"database/sql"
	"log"

	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"
)

func GetUsersConnected(db *sql.DB, sess models.Session, conn *websocket.Conn) {

	// get the user
	users, err := controller.GetMyFriends(db, sess.UserID)
	if err != nil {
		SendGenResponse("error", conn, "this user doesn't exit")
		log.Println("err:", err)
		return
	}
	for i, user := range users {
		if _, ok := ConnectedUsersList[user.ID]; ok {
			users[i].IsOnline = true

		}
		if user.AvatarPath != "" {
			users[i].AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
			if err != nil {
				log.Println("enable to encode image avatar", err.Error())
			}
		}

	}
	if us, ok := ConnectedUsersList[sess.UserID.String()]; ok {
		err := SendGenResponse("users_list", us.Conn, users)
		if err != nil {
			log.Println("users_list was no sent")
			return
		}
	}
	//BroadcastUserList(db)

}

// BroadcastMessage sends a message to all connected users.
func BroadcastUserList(db *sql.DB) {
	for _, user := range ConnectedUsersList {
		if user.Conn != nil {
			id, _ := uuid.FromString(user.UserID)
			usersList, _ := controller.GetMyFriends(db, id)

			err := SendGenResponse("users_list", user.Conn, usersList)
			if err != nil {
				// Handle the error (e.g., log it, remove the user from the map, etc.)
				log.Printf("Failed to send message to user %s: %v", user.UserID, err)
			}
		}
	}
}
