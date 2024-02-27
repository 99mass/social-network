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

	"github.com/gorilla/websocket"
)

type GroupID struct {
	GroupID string `json:"group_id"`
}

func PrivateGroupChat(db *sql.DB) http.HandlerFunc {
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
			log.Println(err)
			return
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
		SendGenResponse("chat_group", conn, message)

		go HandleGroupMessage(db, conn, sess.UserID.String())
	}
}

func HandleGroupMessage(db *sql.DB, conn *websocket.Conn, userID string) {
	for {
		var message models.PrivateGroupeMessages
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			continue
		}
		if len(message.Content) > 100 {
			SendGenResponse("error", conn, "your message is too long, max 100 character")
			continue
		}
		if message.GroupID == "" || message.UserID == "" || message.Content == "" {
			SendGenResponse("error", conn, "invalid type for message")
			continue
		}
		err = SendGroupMessage(db, message)
		if err != nil {
			SendGenResponse("error", conn, err.Error())
			continue
		}

	}
}

func SendGroupMessage(db *sql.DB, message models.PrivateGroupeMessages) error {
	_, err := controller.GetGroupByID(db, message.GroupID)
	if err != nil {
		return errors.New("group given doesn't exist")
	}
	ok, err := controller.IsMember(db, message.UserID, message.GroupID)
	if !ok {
		return err
	}

	err = controller.CreateGroupMessage(db, message)
	if err != nil {
		return errors.New("enable to create your message")
	}
	return nil
}
