package websocket

import (
	"backend/pkg/controller"
	"backend/pkg/models"
	"database/sql"
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

// this function handle the notification for private message
func NotificationMessage(mess models.PrivateMessages) {
	var notif notif_private_message
	notif.Sender = mess.SenderID
	notif.Recipient = mess.RecipientID
	if user, ok := ConnectedUsersList[mess.RecipientID]; ok {
		err := SendGenResponse("notif_private_message", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user")
		}
	}
}

//this one is for sending a notification while someone invite a user to join a group
func NotificationGroupInvitation(db *sql.DB,sender, groupID, userID string) {
	var notif notif_group_invitation
	notif.Group = groupID
	notif.Sender = sender
	
	CreateGeneralNotif(db,userID,groupID,"group_invitation")

	if user, ok := ConnectedUsersList[userID]; ok {
		err := SendGenResponse("notif_group_join_request", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user that you sent the message")
		}
	}
}



func CreateGeneralNotif(db *sql.DB, userID ,sourceID, typeNotif string)error{
	var notif models.Notification
	notif.UserID = userID
	notif.SourceID = sourceID
	notif.Type = typeNotif
	err := controller.CreateNotification(db,notif)
	if err != nil {
		return err
	}
	return nil
}