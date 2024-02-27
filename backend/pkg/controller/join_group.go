package controller

import (
	"backend/pkg/models"
	"database/sql"
	"fmt"
	"time"

	"github.com/gofrs/uuid"
)

func JoinGroupRequest(db *sql.DB, userID, groupID string) error {
	// Check if the user is already a member of the group
	isMember, err := IsMember(db, userID, groupID)
	if err != nil {
		return err
	}
	if isMember {
		return fmt.Errorf("user is already a member of the group")
	}

	// Check if an invitation has already been sent to the user
	isInvitationSent, err := IsInvitationSend(db, groupID, userID)
	if err != nil {
		return err
	}
	if isInvitationSent {
		return fmt.Errorf("an invitation has already been sent to the user")
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
