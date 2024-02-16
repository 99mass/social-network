package controller

import (
	"backend/pkg/models"
	"database/sql"
	"time"

	"github.com/gofrs/uuid"
)

// CreateGroupMembers inserts a new models.Group_Members record into the database.
func CreateGroupInvitations(db *sql.DB, groupInvitations models.Group_Invitations) error {
	query := `
        INSERT INTO group_invitations (id, user_id, group_id, sender_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return err
	}
	_, err = db.Exec(query, newUUID.String(), groupInvitations.UserID, groupInvitations.GroupID, groupInvitations.SenderID, groupInvitations.Status, time.Now(), time.Now())
	if err != nil {
		return err
	}
	return nil
}
