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
func NotificationMessage(db *sql.DB, mess models.PrivateMessages) {
	sender, _ := controller.GetUserNameByID(db, mess.SenderID)
	recipient, _ := controller.GetUserNameByID(db, mess.RecipientID)
	var notif notif_private_message
	notif.Sender = sender
	notif.Recipient = recipient

	CreateGeneralNotif(db, mess.RecipientID, mess.SenderID, "", "private_message")

	if user, ok := ConnectedUsersList[mess.RecipientID]; ok {
		err := SendGenResponse("notif_private_message", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user")
		}
	}
}

// this one is for sending a notification while someone invite a user to join a group
func NotificationGroupInvitation(db *sql.DB, sender, groupID, userID string) {
	sendern, _ := controller.GetUserNameByID(db, sender)
	group, _ := controller.GetGroupTitle(db, groupID)
	var notif notif_group_invitation
	notif.Group = group
	notif.Sender = sendern

	CreateGeneralNotif(db, userID, sender, groupID, "group_invitation")

	if user, ok := ConnectedUsersList[userID]; ok {
		err := SendGenResponse("notif_group_invitation_request", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user that you sent the message")
		}
	}
}

func NotificationFollowRequest(db *sql.DB, senderID, sourceID, userID string) {
	sender, _ := controller.GetUserNameByID(db, senderID)
	recipient, _ := controller.GetUserNameByID(db, userID)
	var notif notif_private_message
	notif.Sender = sender
	notif.Recipient = recipient

	CreateGeneralNotif(db, userID, senderID, sourceID, "follow_request")

	if user, ok := ConnectedUsersList[userID]; ok {
		err := SendGenResponse("notif_follow_request", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user that you sent the message")
		}
	}

}

func NotificationJoinGroup(db *sql.DB, senderID, sourceID, userID string) {
	sender, _ := controller.GetUserNameByID(db, senderID)
	group, _ := controller.GetGroupTitle(db, sourceID)
	var notif notif_group_invitation
	notif.Group = group
	notif.Sender = sender

	CreateGeneralNotif(db, userID, senderID, sourceID, "join_group")

	if user, ok := ConnectedUsersList[userID]; ok {
		err := SendGenResponse("notif_join_group_request", user.Conn, notif)
		if err != nil {
			log.Println("enable to send a notification to the user that you sent the message")
		}
	}
}

func NotificationGroupChat(db *sql.DB, senderID, sourceID string) {
	sender, _ := controller.GetUserNameByID(db, senderID)
	group, _ := controller.GetGroupTitle(db, sourceID)

	var notif notif_group_invitation
	notif.Sender = sender
	notif.Group = group

	members, _ := controller.GetGroupMembers(db, sourceID)
	for _, member := range members {

		if user, ok := ConnectedUsersList[member.ID]; ok {
			if member.ID != senderID {
				CreateGeneralNotif(db, member.ID, senderID, sourceID, "chat_group")
				err := SendGenResponse("notif_chat_group", user.Conn, notif)
				if err != nil {
					log.Println("enable to send a notification to the user that you sent the message")
				}
			}

		}
	}

}

func CreateGeneralNotif(db *sql.DB, userID, senderID, sourceID, typeNotif string) error {
	var notif models.Notification
	notif.UserID = userID
	notif.SourceID = sourceID
	notif.SenderID = senderID
	notif.Type = typeNotif
	err := controller.CreateNotification(db, notif)
	if err != nil {
		return err
	}
	return nil
}
