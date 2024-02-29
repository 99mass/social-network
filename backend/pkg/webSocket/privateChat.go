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
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type GenResponse struct {
	Type    string      `json:"type"`
	Content interface{} `json:"content"`
}

var ConnectedUsersList map[string]*models.UserConnected = make(map[string]*models.UserConnected)

// var userList []models.UserConnected

func ChatHandler(db *sql.DB) http.HandlerFunc {
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

		if user, ok := ConnectedUsersList[sess.UserID.String()]; ok {
			// Si l'utilisateur existe déjà, mettez à jour la connexion
			user.Conn = conn
		} else {
			// Sinon, créez un nouvel utilisateur
			ConnectedUsersList[sess.UserID.String()] = &models.UserConnected{Conn: conn, UserID: sess.UserID.String()}
		}
		log.Println("list of connected users: ", ConnectedUsersList)
		BroadcastUserList(db)
		go HandleMessages(db, conn, sess.UserID.String())
	}
}

func HandleMessages(db *sql.DB, conn *websocket.Conn, userID string) {
	for {

		var message models.PrivateMessages
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("this is the message to sent:", message)
		if err == nil {
			if len(message.Content) > 100 {
				SendGenResponse("error", conn, "message is too long max 100 character")
				continue
			}
			if message.SenderID == "" || message.RecipientID == "" || message.Content == "" {
				SendGenResponse("error", conn, "invalid type for message")
				continue
			}
			err = SendMessage(db, message)
			if err != nil {
				SendGenResponse("error", conn, err.Error())
				continue
			}

			NotificationMessage(db, message)

		}
		BroadcastUserList(db)
	}
}

func SendMessage(db *sql.DB, message models.PrivateMessages) error {
	ok, err := controller.AreUsersFriends(db, message.SenderID, message.RecipientID)
	if err != nil {
		log.Println("users are not friend:", err.Error())
		return errors.New("users are not friend")
	}

	if !ok {
		log.Println("users are not friend:")
		return errors.New("you must be friend first")
	}
	message.CreatedAt = time.Now().Format("2006-01-02 15:04:05")
	if user, ok := ConnectedUsersList[message.RecipientID]; ok {
		err := SendGenResponse("message", user.Conn, message)
		if err != nil {
			log.Println("Private Message was not sent")
			return errors.New("enable to send your message")
		}
	}
	err = SaveMessage(db, message.SenderID, message.RecipientID, message.Content)
	if err != nil {
		log.Println(err.Error())
		return errors.New("enable to save your message")
	}

	log.Println("message sent successfully to : " + message.RecipientID)
	return nil
}

func SaveMessage(db *sql.DB, sender string, recipient string, message string) error {
	var Mes models.PrivateMessages
	Mes.SenderID = sender
	Mes.RecipientID = recipient
	Mes.Content = message
	_, err := controller.CreateMessage(db, Mes)
	if err != nil {
		return errors.New("can't create message : " + err.Error())
	}
	log.Println("message saved successfully")
	return nil
}

var connMutex sync.Mutex

func SendGenResponse(name string, conn *websocket.Conn, message interface{}) error {
	var res GenResponse
	res.Type = name
	res.Content = message

	connMutex.Lock()
	defer connMutex.Unlock()

	err := conn.WriteJSON(res)
	if err != nil {
		return err
	}
	return nil
}

func GetConnectedUsersList() map[string]*models.UserConnected {
	// Créez une copie de la liste pour éviter que les modifications externes n'affectent la liste originale.
	copy := make(map[string]*models.UserConnected)
	for k, v := range ConnectedUsersList {
		copy[k] = v
	}
	return copy
}
