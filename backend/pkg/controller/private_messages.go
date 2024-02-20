package controller

import (
	"database/sql"
	"log"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

// SendPrivateMessage envoie un message privé entre utilisateurs
func SendPrivateMessage(db *sql.DB, message models.PrivateMessages) (uuid.UUID, error) {

	query := `
		INSERT INTO private_messages (id, sender_id, recipient_id, content, created_at)
		VALUES (?, ?, ?, ?, ?)
	`

	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}

	_, err = db.Exec(query, newUUID.String(), message.SenderID, message.RecipientID, message.Content, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}

	return newUUID, nil
}

// GetPrivateMessages récupère les messages privés entre deux utilisateurs
func GetPrivateMessages(db *sql.DB, senderID, recipientID string) ([]models.PrivateMessages, error) {
	query := `
		SELECT * FROM private_messages
		WHERE sender_id = ? AND recipient_id = ?
		ORDER BY created_at DESC
	`
	rows, err := db.Query(query, senderID, recipientID)
	if err != nil {
		log.Println("Error getting private messages: ", err)
		return nil, err
	}
	defer rows.Close()

	var messages []models.PrivateMessages
	for rows.Next() {
		var message models.PrivateMessages
		err := rows.Scan(&message.ID, &message.SenderID, &message.RecipientID, &message.Content, &message.CreatedAt)
		if err != nil {
			log.Println("Error scanning private message: ", err)
			return nil, err
		}

		messages = append(messages, message)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}
