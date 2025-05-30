package controller

import (
	"backend/app/models"
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
        VALUES (?, ?, ?, ?, ?,?,?);
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

func AcceptRequestInvitations(db *sql.DB, userID, groupID string) error {
	// Start a transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback() // Ensure the transaction is rolled back if an error occurs

	// SQL query to delete the invitation
	deleteQuery := `
        DELETE FROM group_invitations
        WHERE user_id = ? AND group_id = ? AND status = 'waiting'
    `
	_, err = tx.Exec(deleteQuery, userID, groupID)
	if err != nil {
		return err
	}

	// SQL query to add the user to the group_members table
	addMemberQuery := `
        INSERT INTO group_members (user_id, group_id)
        VALUES (?, ?)
    `
	_, err = tx.Exec(addMemberQuery, userID, groupID)
	if err != nil {
		return err
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func DeclineGroupInvitaton(db *sql.DB, userID, groupID string) error {
	// Préparez la requête SQL pour supprimer la relation de suivi
	query := `
		DELETE FROM group_invitations
		WHERE user_id = ? AND group_id = ?
	`
	_, err := db.Exec(query, userID, groupID)
	if err != nil {
		log.Println("Error Declining follower request", err.Error())
		return fmt.Errorf("failed to unfollow user: %w", err)
	}
	return nil
}

func GetGroupsInvitation(db *sql.DB, userID string) ([]models.Group, error) {
	query := `
        SELECT g.*
        FROM groups g
        JOIN group_invitations gi ON g.id = gi.group_id
        WHERE gi.user_id = ?
    `
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(&group.ID, &group.Title, &group.Description, &group.CreatorID, &group.CreatedAt, &group.AvatarPath)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GetNumberOfMember(db *sql.DB, groupID string) (int, error) {
	query := `
        SELECT COUNT(*)
        FROM group_members
        WHERE group_id = ?
    `
	var count int
	err := db.QueryRow(query, groupID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func GetGroupsInvitationsSend(db *sql.DB, groupId string) ([]models.Group_Invitations, error) {
	query := `
        SELECT gi.*
        FROM groups g
        JOIN group_invitations gi ON g.id = gi.group_id
        WHERE g.id = ?
    `
	rows, err := db.Query(query, groupId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []models.Group_Invitations
	for rows.Next() {
		var group models.Group_Invitations
		err := rows.Scan(&group.ID, &group.UserID, &group.GroupID, &group.SenderID, &group.Status, &group.CreatedAt, &group.UpdatedAt)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

// Return the number of group inviations waiting
func GetNbrGroupInvitations(db *sql.DB, userID string) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM group_invitations
		WHERE user_id = ? AND status = 'waiting'
	`
	var count int
	err := db.QueryRow(query, userID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
