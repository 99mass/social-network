package controller

import (
	"backend/pkg/models"
	"database/sql"
	"time"

	"github.com/gofrs/uuid"
)

func CreateNotification(db *sql.DB, notification models.Notification) error {
	// Generate a UUID v4 for the new notification
	newUUID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	query := `INSERT INTO notifications 
			(id, user_id, type, source_id, is_read, created_at,sender_id)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`
	_, err = db.Exec(query, newUUID, notification.UserID, notification.Type, notification.SourceID, notification.IsRead, time.Now(), notification.SenderID)

	return err
}

func GetNotificationByID(db *sql.DB, id string) (*models.Notification, error) {
	query := `SELECT id, user_id, type, source_id, is_read, created_at FROM notifications WHERE id = ?`
	row := db.QueryRow(query, id)

	var notification models.Notification
	err := row.Scan(&notification.ID, &notification.UserID, &notification.Type, &notification.SourceID, &notification.IsRead, &notification.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &notification, nil
}

func GetNotificationsByUserID(db *sql.DB, userID string) ([]models.Notification, error) {
	query := `SELECT id, user_id, type, source_id, is_read, created_at FROM notifications WHERE user_id = ?`
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []models.Notification
	for rows.Next() {
		var notification models.Notification
		err := rows.Scan(&notification.ID, &notification.UserID, &notification.Type, &notification.SourceID, &notification.IsRead, &notification.CreatedAt)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}

	return notifications, nil
}

func UpdateNotificationAsRead(db *sql.DB, id string) error {
	query := `UPDATE notifications SET is_read = true WHERE id = ?`
	_, err := db.Exec(query, id)
	return err
}

func DeleteNotificationByID(db *sql.DB, id string) error {
	query := `DELETE FROM notifications WHERE id = ?`
	_, err := db.Exec(query, id)
	return err
}

func DeleteNotificationByUserID(db *sql.DB, userID, typeNotif string) error {
	query := `DELETE FROM notifications WHERE user_id = ? AND type = ?`
	_, err := db.Exec(query, userID, typeNotif)
	return err
}

func DeleteNotificationBySenderAndUser(db *sql.DB, senderID, userID, typeNotif string) error {
	query := `DELETE FROM notifications WHERE sender_id = ? AND user_id = ? AND type = ?`
	_, err := db.Exec(query,senderID, userID, typeNotif)
	return err
}

// GetNotificationCountByType retrieves the number of notifications of a specific type for a specific user.
func GetNotificationCountByType(db *sql.DB, userID string, notificationType string) (int, error) {
	// Prepare the SQL query to count notifications by type for a specific user.
	query := `
		SELECT COUNT(*) as count
		FROM notifications
		WHERE user_id = ? AND type = ?;
	`

	// Execute the query and retrieve the result.
	var count int
	err := db.QueryRow(query, userID, notificationType).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}
