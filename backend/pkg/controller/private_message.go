package controller

import (
	"backend/pkg/models"
	"database/sql"
	"time"

	"github.com/gofrs/uuid"
)

func CreateMessage(db *sql.DB, message models.PrivateMessages) (uuid.UUID, error) {
	query := `
        INSERT INTO private_messages (id, sender_id, recipient_id, content, created_at)
        VALUES (?, ?, ?, ?, ?);
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
