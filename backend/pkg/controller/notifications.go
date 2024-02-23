package controller

import (
	"backend/pkg/models"
	"database/sql"

	"github.com/gofrs/uuid"
)

func CreateNotification(db *sql.DB, notification models.Notification) error {
	query := `INSERT INTO notifications (id, user_id, type, source_id, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := db.Exec(query, notification.ID, notification.UserID, notification.Type, notification.SourceID, notification.IsRead, notification.CreatedAt)
	return err
}

func GetNotificationByID(db *sql.DB, id uuid.UUID) (*models.Notification, error) {
	query := `SELECT id, user_id, type, source_id, is_read, created_at FROM notifications WHERE id = ?`
	row := db.QueryRow(query, id)

	var notification models.Notification
	err := row.Scan(&notification.ID, &notification.UserID, &notification.Type, &notification.SourceID, &notification.IsRead, &notification.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &notification, nil
}

func GetNotificationsByUserID(db *sql.DB, userID uuid.UUID) ([]models.Notification, error) {
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

func UpdateNotificationAsRead(db *sql.DB, id uuid.UUID) error {
	query := `UPDATE notifications SET is_read = true WHERE id = ?`
	_, err := db.Exec(query, id)
	return err
}

func DeleteNotification(db *sql.DB, id uuid.UUID) error {
	query := `DELETE FROM notifications WHERE id = ?`
	_, err := db.Exec(query, id)
	return err
}
