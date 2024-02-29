package websocket

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"

	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
)

type messageToSend struct {
	Sender    string
	Recipient string
	Message   string
	Created   string
}

func CommunicationHandler(db *sql.DB) http.HandlerFunc {
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
		type requestUSer struct {
			User1 string `json:"user1"`
			User2 string `json:"user2"`
		}
		var request requestUSer
		err = conn.ReadJSON(&request)
		if err != nil {
			fmt.Println(err)
			return
		}
		request.User1 = sess.UserID.String()
		discuss, err := GetCommunication(db, request.User1, request.User2)
		if err != nil {
			SendGenResponse("error", conn, "incorrect userID")
			log.Println("enable to get discussion", err)

			return
		}

		goodDiscuss, err := GoodToSend(db, discuss)
		if err != nil {
			log.Println(err)

			return
		}
		controller.DeleteNotificationBySenderAndUser(db, request.User2, sess.UserID.String(), "private_message")
		BroadcastUserList(db)
		PopupSocket(db)
		conn.WriteJSON(goodDiscuss)

	}
}

func GetCommunication(db *sql.DB, user1 string, user2 string) ([]models.PrivateMessages, error) {
	idUser1, err := uuid.FromString(user1)
	if err != nil {
		return nil, errors.New("invalid user")
	}
	idUser2, err := uuid.FromString(user2)
	if err != nil {
		return nil, errors.New("invalid user")
	}

	discussion := controller.GetDiscussion(db, idUser1, idUser2)

	return discussion, nil
}

func GoodToSend(db *sql.DB, discuss []models.PrivateMessages) ([]messageToSend, error) {

	var messToSend []messageToSend
	for _, m := range discuss {

		var mes messageToSend

		mes.Sender = m.SenderID
		mes.Recipient = m.RecipientID
		mes.Message = m.Content
		mes.Created = m.CreatedAt
		messToSend = append(messToSend, mes)
	}

	return messToSend, nil
}

func GetUsername(db *sql.DB, user uuid.UUID) (string, error) {
	us, err := controller.GetUserByID(db, user)
	if err != nil {
		return "", err
	}
	return us.Nickname, nil
}
