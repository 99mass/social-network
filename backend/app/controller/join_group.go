package controller

import (
	"backend/app/models"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/gofrs/uuid"
)

// Send a request to join a group
func JoinGroupRequest(db *sql.DB, userID, groupID string) error {
	// Check if the user is already a member of the group
	isMember, err := IsMember(db, userID, groupID)
	if err != nil {
		return err
	}
	if isMember {
		return fmt.Errorf("user is already a member of the group")
	}

	log.Println("check is join request")
	// Check if an invitation has already been sent to the user
	isJoinRequest, err := IsJoinRequestSend(db, userID, groupID)
	if err != nil {
		return err
	}
	if isJoinRequest {
		log.Println("a join request has already been sent to the group owner")
		return errors.New("already sent")
	}

	// Create a new group invitation record
	newUUID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	query := `
        INSERT INTO group_join_requests (id, user_id, group_id, message, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `
	_, err = db.Exec(query, newUUID.String(), userID, groupID, "", "waiting", time.Now(), time.Now())
	if err != nil {
		return err
	}

	return nil
}

// Get all request for joinning a group
func GetGroupJoinRequestsInfo(db *sql.DB, groupID string) ([]models.UserJoinGroupInfo, error) {
	query := `
	SELECT  
		u.id AS user_id,
		u.firstname AS user_firstname,
		u.lastname AS user_lastname,
		g.id AS group_id,
		u.avatarpath AS avatarpath
	FROM  
		users u
	JOIN  
		group_join_requests gjr ON u.id = gjr.user_id
	JOIN  
		groups g ON gjr.group_id = g.id
	WHERE  
		g.id = ?;
	`

	rows, err := db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var usersInfo []models.UserJoinGroupInfo
	for rows.Next() {
		var userInfo models.UserJoinGroupInfo
		err := rows.Scan(&userInfo.UserID, &userInfo.FirstName, &userInfo.LastName, &userInfo.GroupID, &userInfo.UserAvartaPath)
		if err != nil {
			return nil, err
		}
		usersInfo = append(usersInfo, userInfo)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return usersInfo, nil
}

// Verify if the users has already sent a request to join a group
func IsJoinRequestSend(db *sql.DB, userid, groupid string) (bool, error) {
	query := `
    SELECT COUNT(*)
    FROM group_join_requests
    WHERE user_id = ? AND group_id = ?;
    `

	var count int
	err := db.QueryRow(query, userid, groupid).Scan(&count)
	if err != nil {
		return false, err
	}
	log.Println("no error")
	return count > 0, nil
}

// Accepte a join group request
func AcceptJoinGroupRequest(db *sql.DB, userid, groupid string) error {
	// Start a transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback() // Ensure the transaction is rolled back if an error occurs

	// SQL query to delete the join request
	deleteQuery := `
        DELETE FROM group_join_requests
        WHERE user_id = ? AND group_id = ?
    `
	_, err = tx.Exec(deleteQuery, userid, groupid)
	if err != nil {
		return err
	}

	// SQL query to add the user to the group_members table
	addMemberQuery := `
        INSERT INTO group_members (user_id, group_id, is_creator)
        VALUES (?, ?, ?)
    `
	_, err = tx.Exec(addMemberQuery, userid, groupid, false)
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
func RejectJoinGroupRequest(db *sql.DB, userid, groupid string) error {
	// SQL query to delete the join request
	query := `
        DELETE FROM group_join_requests
        WHERE user_id = ? AND group_id = ?
    `
	_, err := db.Exec(query, userid, groupid)
	if err != nil {
		return err
	}

	return nil
}

func LeaveInGroupRequest(db *sql.DB, userid, groupid string) error {
	// SQL query to delete the join request
	query := `
        DELETE FROM group_members
        WHERE user_id = ? AND group_id = ?
    `
	_, err := db.Exec(query, userid, groupid)
	if err != nil {
		return err
	}

	return nil
}
