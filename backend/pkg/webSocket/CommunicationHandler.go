package websocket

import (
	"backend/pkg/controller"
	"backend/pkg/helper"
	"backend/pkg/models"
	"backend/pkg/utils"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"
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
		_, err = controller.GetSessionByID(db, sessid)
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
		// fmt.Println(request.User1)
		// fmt.Println(request.User2)
		discuss, err := GetCommunication(db, request.User1, request.User2)
		if err != nil {
			fmt.Println(err)
			conn.Close()
			return
		}

		goodDiscuss, err := GoodToSend(db, discuss)
		if err != nil {
			log.Println(err)
			conn.Close()
			return
		}
		//fmt.Println(goodDiscuss)
		conn.WriteJSON(goodDiscuss)
		conn.Close()

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
		//fmt.Println(m.Message)
		var mes messageToSend
		senderID, err := uuid.FromString(m.SenderID)
		if err != nil {
			return nil, err
		}
		send, err := GetUsername(db, senderID)
		if err != nil {
			return nil, err
		}
		mes.Sender = send
		recipientID, err := uuid.FromString(m.RecipientID)
		if err != nil {
			return nil, err
		}
		recep, err := GetUsername(db, recipientID)
		if err != nil {
			return nil, err
		}
		mes.Recipient = recep
		mes.Message = m.Content
		mes.Created = m.CreatedAt
		messToSend = append(messToSend, mes)
	}
	//fmt.Println(messToSend)
	return messToSend, nil
}
func GetUsername(db *sql.DB, user uuid.UUID) (string, error) {
	us, err := controller.GetUserByID(db, user)
	if err != nil {
		return "", err
	}
	return us.Nickname, nil
}
