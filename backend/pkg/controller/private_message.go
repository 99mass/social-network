package controller

import (
	"backend/pkg/models"
	"database/sql"
	"log"
	"sort"
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

	err := sortMessagesByCreatedAt(messages)
	if err!= nil {
		log.Println("error lors du filtrage:",err.Error())
		return nil
	}

	// // Sort messages by creation date
	// sort.Slice(messages, func(i, j int) bool {
	// 	return messages[i].CreatedAt.Before(messages[j].CreatedAt)
	// })

	return messages
}

func parseCreatedAt(createdAt string) (time.Time, error) {
	return time.Parse(time.RFC3339, createdAt)
}

// Trie le tableau de messages par CreatedAt
func sortMessagesByCreatedAt(messages []models.PrivateMessages) error {
	// Convertir et trier
	sort.Slice(messages, func(i, j int) bool {
		createdAtI, err := parseCreatedAt(messages[i].CreatedAt)
		if err != nil {
			return false
		}
		createdAtJ, err := parseCreatedAt(messages[j].CreatedAt)
		if err != nil {
			return false
		}
		return createdAtI.Before(createdAtJ)
	})
	return nil
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
