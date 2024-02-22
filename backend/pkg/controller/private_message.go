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

func GetDiscussion(db *sql.DB, user1 uuid.UUID, user2 uuid.UUID) []models.PrivateMessages {
	var messages []models.PrivateMessages

	// Get all messages sent by user 1
	messages1 := getMessagesForUser(db, user1)
	// Get all messages sent by user 2
	messages2 := getMessagesForUser(db, user2)

	// Find messages sent to both users
	for _, m1 := range messages1 {
		if m1.RecipientID == user2.String() {
			messages = append(messages, m1)
		}
	}

	for _, m2 := range messages2 {
		if m2.RecipientID == user1.String() {
			messages = append(messages, m2)
		}
	}

	// // Sort messages by creation date
	// sort.Slice(messages, func(i, j int) bool {
	// 	return messages[i].CreatedAt.Before(messages[j].CreatedAt)
	// })

	return messages
}

func getMessagesForUser(db *sql.DB, userID uuid.UUID) []models.PrivateMessages {
	query := `
        SELECT id, sender_id, recipient_id, content, created_at
        FROM private_messages
        WHERE recipient_id = ?
        OR sender_id = ?;
    `

	rows, err := db.Query(query, userID.String(), userID.String())
	if err != nil {
		return []models.PrivateMessages{}
	}
	defer rows.Close()

	var messages []models.PrivateMessages
	for rows.Next() {
		var message models.PrivateMessages
		err := rows.Scan(&message.ID, &message.SenderID, &message.RecipientID, &message.Content, &message.CreatedAt)
		if err != nil {
			return []models.PrivateMessages{}
		}
		messages = append(messages, message)
	}

	return messages
}
