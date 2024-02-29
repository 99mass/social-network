package websocket

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"errors"
	"log"
	"net/http"

	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"
)

var GroupConnectedUsersList map[string]*models.UserGroupConnected = make(map[string]*models.UserGroupConnected)

type GroupID struct {
	GroupID string `json:"group_id"`
}
type MessageGroupToSend struct {
	Message models.PrivateGroupeMessages `json:"message"`
	User    models.User                  `json:"user"`
}

func PrivateGroupChat(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessid, err := utils.TextToUUID(r.URL.Query().Get("Authorization"))
		if err != nil {
			helper.SendResponseError(w, "error", "you're not authorized", http.StatusBadRequest)
			return
		}
		//TODO:Remplis l'id et le verifier
		idGroup := r.URL.Query().Get("group_id")
		log.Println("id du group", idGroup)
		_, err = controller.GetGrpByID(db, idGroup)
		if err != nil {
			helper.SendResponseError(w, "error", "invalid group id", http.StatusBadRequest)
			return
		}
		sess, err := controller.GetSessionByID(db, sessid)
		if err != nil {
			helper.SendResponseError(w, "error", "invalid session", http.StatusBadRequest)
			return
		}
		verif, err := controller.IsMember(db, sess.UserID.String(), idGroup)
		if !verif {
			log.Println("l'utilisateur tente d'acceder a un groupe qui n'est pas sien", err.Error())
			helper.SendResponseError(w, "error", "invalid id group", http.StatusBadRequest)
			return
		}
		controller.DeleteNotificationJoinGroup(db, sess.UserID.String(), idGroup, "join_group")
		BroadcastUserList(db)
		PopupSocket(db)
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		if user, ok := GroupConnectedUsersList[sess.UserID.String()]; ok {
			// Si l'utilisateur existe déjà, mettez à jour la connexion
			user.Conn = conn
			user.GroupID = idGroup
		} else {
			// Sinon, créez un nouvel utilisateur
			GroupConnectedUsersList[sess.UserID.String()] = &models.UserGroupConnected{Conn: conn, UserID: sess.UserID.String(), GroupID: idGroup}
		}

		var group GroupID
		err = conn.ReadJSON(&group)
		if err != nil {
			log.Println("can't read the json message")
			return
		}
		ok, err := controller.IsMember(db, sess.UserID.String(), group.GroupID)
		if !ok {
			log.Println(err.Error())
		}
		message, err := controller.GetGroupMessage(db, group.GroupID)
		if err != nil {
			log.Println("enable to get the chat of the group,", err.Error())
			return
		}
		var ToSend []MessageGroupToSend
		for _, mes := range message {
			usID, _ := uuid.FromString(mes.UserID)
			user, err := controller.GetUserByID(db, usID)
			if err != nil {
				log.Println("cant get the user", err.Error())
				return
			}
			var good MessageGroupToSend
			if user.AvatarPath != "" {
				user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
				if err != nil {
					log.Println("enable to encode image avatar", err.Error())

				}
			}

			good.Message = mes
			good.User = user
			ToSend = append(ToSend, good)
		}

		SendGenResponse("chat_group", conn, ToSend)

		go HandleGroupMessage(db, conn, sess.UserID.String())
	}
}

func HandleGroupMessage(db *sql.DB, conn *websocket.Conn, userID string) {
	for {
		var message models.PrivateGroupeMessages
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			return
		}
		if len(message.Content) > 100 {
			SendGenResponse("error", conn, "your message is too long, max 100 character")
			continue
		}
		if message.GroupID == "" || userID == "" || message.Content == "" {
			SendGenResponse("error", conn, "invalid type for message")
			continue
		}
		err = SendGroupMessage(db, message, userID)
		if err != nil {
			SendGenResponse("error", conn, err.Error())
			continue
		}
		NotificationGroupChat(db, userID, message.GroupID)
		BroadcastUserList(db)
		PopupSocket(db)

	}
}

func SendGroupMessage(db *sql.DB, message models.PrivateGroupeMessages, userID string) error {
	_, err := controller.GetGroupByID(db, message.GroupID)
	if err != nil {
		return errors.New("group given doesn't exist")
	}
	ok, err := controller.IsMember(db, userID, message.GroupID)
	if !ok {
		return err
	}

	_, err = controller.CreateGroupMessage(db, message, userID)
	if err != nil {
		return errors.New("enable to create your message")
	}

	BroadcastGroupMessage(db, message.GroupID)

	return nil
}

func BroadcastGroupMessage(db *sql.DB, GroupID string) {
	for _, user := range GroupConnectedUsersList {
		if user.Conn != nil {
			ok, _ := controller.IsMember(db, user.UserID, GroupID)
			if ok {
				if user.GroupID == GroupID {
					message, err := controller.GetGroupMessage(db, GroupID)
					if err != nil {
						log.Println("enable to get the chat of the group,", err.Error())
						return
					}
					var ToSend []MessageGroupToSend
					for _, mes := range message {
						usID, _ := uuid.FromString(mes.UserID)
						user, err := controller.GetUserByID(db, usID)
						if err != nil {
							log.Println("cant get the user", err.Error())
							return
						}
						var good MessageGroupToSend
						if user.AvatarPath != "" {
							user.AvatarPath, err = helper.EncodeImageToBase64("./pkg/static/avatarImage/" + user.AvatarPath)
							if err != nil {
								log.Println("enable to encode image avatar", err.Error())

							}
						}

						good.Message = mes
						good.User = user
						ToSend = append(ToSend, good)
					}

					SendGenResponse("chat_group", user.Conn, ToSend)
				}

			}

		}
	}
}
