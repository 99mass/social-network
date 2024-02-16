package controller

import (
	"backend/pkg/models"
	"database/sql"
	"fmt"
	"log"
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
	_, err = db.Exec(query, newUUID.String(), groupInvitations.UserID, groupInvitations.GroupID, groupInvitations.SenderID, "waiting", time.Now(), time.Now())
	if err != nil {
		return err
	}
	return nil
}

func AcceptRequestInvitations(db *sql.DB, userID, senderID, groupID string) error {
	// Préparez la requête SQL pour mettre à jour la colonne status en 'accepted'
	query := `
		UPDATE group_invitations
		SET status = 'accepted', updated_at = ?
		WHERE user_id = ? AND sender_id = ? AND group_id = ? AND status = "waiting"
	`

	_, err := db.Exec(query, time.Now(), userID, senderID, groupID)
	if err != nil {
		log.Println("Error accepting")
		return fmt.Errorf("failed to accept follow request: %w", err)
	}
	return nil
}

func DeclineGroupInvitaton(db *sql.DB, userID, senderID, groupID string) error {
	// Préparez la requête SQL pour supprimer la relation de suivi
	query := `
		DELETE FROM group_invitations
		WHERE user_id = ? AND sender_id = ? AND group_id = ?
	`
	_, err := db.Exec(query, userID, senderID, groupID)
	if err != nil {
		log.Println("Error Declining follower request", err.Error())
		return fmt.Errorf("failed to unfollow user: %w", err)
	}

	return nil
}
