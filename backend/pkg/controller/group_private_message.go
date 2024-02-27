package controller

import (
	"backend/pkg/models"
	"database/sql"
	"fmt"
	"time"

	"github.com/gofrs/uuid"
)

func CreateGroupMessage(db *sql.DB, message models.PrivateGroupeMessages, userID string) error {

	query := `
			INSERT INTO group_chat_messages (id, group_id, user_id, content, created_at)
			VALUES (?, ?, ?, ?, ?);
		`

	newUUID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	_, err = db.Exec(query, newUUID.String(), message.GroupID, userID, message.Content, time.Now().Format("2006-01-02 15:04:05"))
	if err != nil {
		return err
	}

	return nil
}

// GetGroupMessage retrieves the group messages by group ID.
func GetGroupMessage(db *sql.DB, groupID string) ([]models.PrivateGroupeMessages, error) {
	query := `
		SELECT id, group_id, user_id, content, created_at
		FROM group_chat_messages
		WHERE group_id = ?
		ORDER BY created_at DESC;
	`

	// Execute the query and retrieve the results.
	rows, err := db.Query(query, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to query group messages: %w", err)
	}
	defer rows.Close()

	// Initialize a slice to hold the results.
	var messages []models.PrivateGroupeMessages

	// Iterate over the rows and populate the messages slice.
	for rows.Next() {
		var message models.PrivateGroupeMessages
		err := rows.Scan(&message.ID, &message.GroupID, &message.UserID, &message.Content, &message.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		messages = append(messages, message)
	}

	// Check for any errors that occurred during iteration.
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during iteration: %w", err)
	}

	return messages, nil
}
