package controller

import (
	"database/sql"
	"time"

	"github.com/gofrs/uuid"

	"backend/pkg/models"
)

func CreateGroup(db *sql.DB, group models.Group) (uuid.UUID, error) {
	query := `
        INSERT INTO groups (id, title, description, creator_id, avatarpath, created_at)
        VALUES (?, ?, ?, ?, ?, ?);
    `
	newUUID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}
	_, err = db.Exec(query, newUUID.String(), group.Title, group.Description, group.CreatorID, group.AvatarPath, time.Now())
	if err != nil {
		return uuid.UUID{}, err
	}
	return newUUID, nil
}

func GetGroupByID(db *sql.DB, groupID string) (bool, error) {
	query := `
		SELECT COUNT(*)
		FROM groups
		WHERE id = ?
	`
	var count int
	err := db.QueryRow(query, groupID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func IsMember(db *sql.DB, userID, groupID string) (bool, error) {
	query := `
        SELECT COUNT(*)
        FROM group_members
        WHERE user_id = ? AND group_id = ?
    `
	var count int
	err := db.QueryRow(query, userID, groupID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func GetMyGroups(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups a user is a member of
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        INNER JOIN group_members m ON g.id = m.group_id
        WHERE m.user_id = ?
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GetGroupInfosById(db *sql.DB, groupID uuid.UUID) (models.GroupInfos, error) {
	// SQL query to get group information by ID
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        LEFT JOIN group_members m ON g.id = m.group_id
        WHERE g.id = ?
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return models.GroupInfos{}, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(groupID)
	if err != nil {
		return models.GroupInfos{}, err
	}
	defer rows.Close()

	var group models.GroupInfos
	for rows.Next() {

		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return models.GroupInfos{}, err
		}

	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return models.GroupInfos{}, err
	}

	return group, nil
}

func GroupsIManage(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups a user manages
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        LEFT JOIN group_members m ON g.id = m.group_id
        WHERE g.creator_id = ?
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GroupsToDiscover(db *sql.DB, userID string) ([]models.GroupInfos, error) {
	// SQL query to get all groups that a user is not a member of
	query := `
        SELECT g.id, g.title, g.avatarpath, COUNT(m.user_id) as nbr_members
        FROM groups g
        LEFT JOIN group_members m ON g.id = m.group_id AND m.user_id = ?
        WHERE m.user_id IS NULL
        GROUP BY g.id
    `

	// Prepare the statement
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the query
	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a slice of GroupInfos
	var groups []models.GroupInfos
	for rows.Next() {
		var group models.GroupInfos
		err := rows.Scan(&group.ID, &group.Title, &group.AvatarPath, &group.NbrMembers)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return groups, nil
}

func GetNonGroupFollowers(db *sql.DB, userID uuid.UUID, groupId string) ([]models.User, error) {
	friends, err := GetMyFriends(db, userID)
	if err != nil {
		return nil, err
	}

	unfollowuser := []models.User{}

	for _, user := range friends {

		isInvitationSend, errr := IsInvitationSend(db, groupId, user.ID)

		if err != nil || errr != nil {
			return nil, err
		}

		if !isInvitationSend {
			unfollowuser = append(unfollowuser, user)
		}
	}
	return unfollowuser, nil
}

func IsInvitationSend(db *sql.DB, groupId string, userId string) (bool, error) {
	invitationSend, err := GetGroupsInvitationsSend(db, groupId)

	if err != nil {
		return false, err
	}

	for _, invit := range invitationSend {
		if invit.UserID == userId {
			return true, nil
		}
	}
	return false, nil

}
