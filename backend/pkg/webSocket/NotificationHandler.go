package websocket

import (
	"backend/pkg/models"
	"log"
)

type notif_private_message struct {
	Sender    string `json:"sender"`
	Recipient string `json:"recipient"`
}
type notif_group_invitation struct {
	Sender string `json:"sender"`
	Group  string `json:"group"`
}

func NotificationMessage(mess models.PrivateMessages) {
	var notif notif_private_message
	notif.Sender = mess.SenderID
	notif.Recipient = mess.RecipientID
	if user, ok := ConnectedUsersList[mess.RecipientID]; ok {
		err := SendGenResponse("notif_private_message", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user that you sent the message")
		}
	}
}

func NotificationGroupInvitation(sender, group, userID string) {
	var notif notif_group_invitation
	notif.Group = group
	notif.Sender = sender
	if user, ok := ConnectedUsersList[userID]; ok {
		err := SendGenResponse("notif_group_join_request", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user that you sent the message")
		}
	}
}
